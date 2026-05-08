'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export function StatusScreen({ status, onRetry, onReset, transactionId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Focus management for accessibility when screen appears
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [status]);

  if (status === 'idle') return null;

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Processing Payment</h3>
            <p className="text-slate-500">Please do not close or refresh this window.</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Payment Successful!</h3>
            <p className="text-slate-500">Your transaction <span className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">{transactionId}</span> has been processed successfully.</p>
            <Button onClick={onReset} className="mt-6 w-full sm:w-auto px-8 bg-slate-900 hover:bg-slate-800">
              Make Another Payment
            </Button>
          </div>
        );

      case 'failed':
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Payment Failed</h3>
            <p className="text-slate-500">Your card was declined or the transaction could not be processed. Please check your details and try again.</p>
            <div className="flex gap-3 mt-6 w-full justify-center">
              <Button onClick={onReset} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 w-full sm:w-auto px-6">
                Edit Details
              </Button>
              <Button onClick={onRetry} className="w-full sm:w-auto px-8 bg-blue-600">
                Try Again
              </Button>
            </div>
          </div>
        );

      case 'timeout':
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Connection Timed Out</h3>
            <p className="text-slate-500">The gateway took too long to respond. Don't worry, no charges were made.</p>
            <div className="flex gap-3 mt-6 w-full justify-center">
              <Button onClick={onReset} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 w-full sm:w-auto px-6">
                Go Back
              </Button>
              <Button onClick={onRetry} className="w-full sm:w-auto px-8 bg-blue-600">
                Retry Now
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 rounded-2xl flex items-center justify-center p-6 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      tabIndex={-1}
      ref={containerRef}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
        {renderContent()}
      </div>
    </div>
  );
}
