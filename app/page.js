'use client';

import { useSelector, useDispatch } from 'react-redux';
import { setFlipped } from '../redux/paymentSlice';
import { PaymentForm } from '../components/PaymentForm';
import { CardPreview } from '../components/CardPreview';
import { TransactionHistory } from '../components/TransactionHistory';
import { Card } from '../components/Card';
import { getCardType } from '../utils/card';

export default function Home() {
  const dispatch = useDispatch();
  const { cardNumber, cardHolderName, expiryDate, cvv, isFlipped } = useSelector((state) => state.payment);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Gateway</h1>
        <p className="text-slate-500 mt-2">Complete your payment securely below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Form */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <Card title="Payment Details">
            <PaymentForm />
          </Card>
        </div>

        {/* Right Section: Card Preview */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-8 self-start">
          <CardPreview 
            cardNumber={cardNumber}
            cardHolderName={cardHolderName}
            expiryDate={expiryDate}
            cvv={cvv}
            isFlipped={isFlipped}
            cardType={getCardType(cardNumber)}
            onCardClick={() => dispatch(setFlipped(!isFlipped))}
          />
        </div>
      </div>

      {/* Bottom Section: Transaction History */}
      <div className="pt-8">
        <TransactionHistory />
      </div>
    </main>
  );
}
