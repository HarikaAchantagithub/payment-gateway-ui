'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setFlipped, addTransactionToHistory, updateTransactionInHistory, setStatus, setCurrentTransaction, incrementRetry, resetRetry } from '../redux/paymentSlice';
import { Input } from './Input';
import { Button } from './Button';
import { StatusScreen } from './StatusScreen';
import { formatCardNumber, formatExpiryDate } from '../utils/formatters';
import { validateCardNumber, validateExpiryDate, validateCVV, validateCardHolder, validateAmount } from '../utils/validation';

export function PaymentForm() {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    if (!paymentState.cardNumber) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (!validateCardNumber(paymentState.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number.';
    }

    if (!paymentState.cardHolderName) {
      newErrors.cardHolderName = 'Cardholder name is required.';
    } else if (!validateCardHolder(paymentState.cardHolderName)) {
      newErrors.cardHolderName = 'Please enter a valid name.';
    }

    if (!paymentState.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required.';
    } else if (!validateExpiryDate(paymentState.expiryDate)) {
      newErrors.expiryDate = 'Enter a valid expiry date (e.g., 12/25).';
    }

    if (!paymentState.cvv) {
      newErrors.cvv = 'CVV is required.';
    } else if (!validateCVV(paymentState.cvv, paymentState.cardNumber)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits.';
    }

    if (!paymentState.amount) {
      newErrors.amount = 'Amount is required.';
    } else if (!validateAmount(paymentState.amount)) {
      newErrors.amount = 'Please enter a valid amount.';
    }

    if (!paymentState.currency) {
      newErrors.currency = 'Currency is required.';
    }
    
    setErrors(newErrors);
  }, [paymentState]);

  const isFormValid = Object.keys(errors).length === 0;
  const isRetry = paymentState.status === 'failed' || paymentState.status === 'timeout';
  const isMaxRetries = paymentState.retryAttempts >= 3;

  const handleFocus = (e) => {
    if (e.target.name === 'cvv') {
      dispatch(setFlipped(true));
    } else {
      dispatch(setFlipped(false));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    if (e.target.name === 'cvv') {
      dispatch(setFlipped(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'amount') {
      // Allow only numbers and one decimal point
      formattedValue = value.replace(/[^0-9.]/g, '');
      const parts = formattedValue.split('.');
      if (parts.length > 2) {
        formattedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    dispatch(updateField({ field: name, value: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all as touched to show errors if any
    setTouched({
      cardNumber: true,
      cardHolderName: true,
      expiryDate: true,
      cvv: true,
      amount: true,
    });

    if (!isFormValid || isProcessing || isMaxRetries) return;

    setIsProcessing(true);
    dispatch(setStatus('processing'));

    let txId;
    if (isRetry) {
      dispatch(incrementRetry());
      txId = paymentState.currentTransaction?.id;
      if (!txId) {
        txId = `tx_${Math.random().toString(36).substring(2, 12)}`;
        dispatch(setCurrentTransaction({ id: txId }));
      }
      dispatch(updateTransactionInHistory({
        id: txId,
        updates: { status: 'Processing', date: new Date().toISOString() }
      }));
    } else {
      dispatch(resetRetry());
      txId = `tx_${Math.random().toString(36).substring(2, 12)}`;
      dispatch(setCurrentTransaction({ id: txId }));
      dispatch(addTransactionToHistory({
        id: txId,
        amount: parseFloat(paymentState.amount),
        currency: paymentState.currency,
        status: 'Processing',
        date: new Date().toISOString(),
        last4: paymentState.cardNumber.slice(-4),
      }));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: txId,
          cardNumber: paymentState.cardNumber.replace(/\s+/g, ''),
          cardHolderName: paymentState.cardHolderName,
          expiryDate: paymentState.expiryDate,
          cvv: paymentState.cvv,
          amount: parseFloat(paymentState.amount),
          currency: paymentState.currency,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        dispatch(setStatus('success'));
        dispatch(updateTransactionInHistory({
          id: txId,
          updates: { status: 'Success', date: data.timestamp }
        }));
      } else {
        dispatch(setStatus('failed'));
        dispatch(updateTransactionInHistory({
          id: txId,
          updates: { status: 'Failed' }
        }));
        alert(`Payment Failed: ${data.reason || data.message || 'Unknown error'}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        dispatch(setStatus('timeout'));
        dispatch(updateTransactionInHistory({
          id: txId,
          updates: { status: 'Timeout' }
        }));
        alert('Payment timed out. Please try again.');
      } else {
        dispatch(setStatus('failed'));
        dispatch(updateTransactionInHistory({
          id: txId,
          updates: { status: 'Failed' }
        }));
        alert('Network error occurred. Please check your connection.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    dispatch(setStatus('idle'));
  };

  const getError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  };

  return (
    <div className="relative">
    <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off" aria-label="Payment Form">
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col space-y-1">
          <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount<span className="text-red-500 ml-1">*</span></label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            value={paymentState.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="0.00"
            className={`px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200 ${
              getError('amount') ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200 hover:border-slate-300'
            }`}
            aria-invalid={!!getError('amount')}
            aria-describedby={getError('amount') ? "amount-error" : undefined}
          />
          {getError('amount') && <span id="amount-error" className="text-xs text-red-500 mt-1 font-medium animate-in slide-in-from-top-1 fade-in duration-200">{getError('amount')}</span>}
        </div>
        <div className="w-1/3 flex flex-col space-y-1">
          <label htmlFor="currency" className="text-sm font-medium text-slate-700">Currency<span className="text-red-500 ml-1">*</span></label>
          <select
            id="currency"
            name="currency"
            value={paymentState.currency}
            onChange={handleChange}
            onFocus={handleFocus}
            className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
            aria-label="Select Currency"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <Input
        id="cardHolderName"
        label="Cardholder Name"
        name="cardHolderName"
        required
        value={paymentState.cardHolderName}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={getError('cardHolderName')}
        placeholder="Cardholder Name"
        autoComplete="cc-name"
        aria-required="true"
      />

      <Input
        id="cardNumber"
        label="Card Number"
        name="cardNumber"
        required
        type="tel"
        inputMode="numeric"
        value={paymentState.cardNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={getError('cardNumber')}
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        autoComplete="cc-number"
        aria-required="true"
      />

      <div className="flex gap-4">
        <Input
          id="expiryDate"
          label="Expiry Date"
          name="expiryDate"
          required
          type="tel"
          value={paymentState.expiryDate}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={getError('expiryDate')}
          placeholder="MM/YY"
          className="flex-1"
          maxLength={5}
          autoComplete="cc-exp"
          aria-required="true"
        />
        <Input
          id="cvv"
          label="CVV"
          name="cvv"
          required
          type="password"
          inputMode="numeric"
          value={paymentState.cvv}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={getError('cvv')}
          placeholder="123"
          className="flex-1"
          maxLength={4}
          autoComplete="cc-csc"
          aria-required="true"
        />
      </div>

      <Button 
        type="submit" 
        className={`w-full mt-6 ${(!isFormValid && touched.cardNumber) || isMaxRetries ? 'opacity-50 cursor-not-allowed' : ''}`} 
        isLoading={isProcessing}
        disabled={!isFormValid || isProcessing || isMaxRetries}
        aria-disabled={!isFormValid || isProcessing || isMaxRetries}
      >
        {isMaxRetries 
          ? 'Maximum Retries Exceeded' 
          : isRetry 
            ? `Retry Payment (${paymentState.retryAttempts}/3)`
            : paymentState.amount ? `Pay ${paymentState.currency === 'USD' ? '$' : '₹'}${parseFloat(paymentState.amount || 0).toFixed(2)}` : 'Pay Now'}
      </Button>

      <StatusScreen
        status={paymentState.status}
        onRetry={handleSubmit}
        onReset={handleReset}
        transactionId={paymentState.currentTransaction?.id}
      />
    </form>
    </div>
  );
}
