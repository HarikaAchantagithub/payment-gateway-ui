'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from './Card';
import { formatCurrency } from '../utils/formatters';
import { setSelectedTransaction } from '../redux/paymentSlice';

export function TransactionHistory() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.payment.history);

  const handleRowClick = (tx) => {
    dispatch(setSelectedTransaction(tx));
    console.log('Transaction clicked:', tx);
    alert(`Transaction Details:\nID: ${tx.id}\nAmount: ${formatCurrency(tx.amount, tx.currency || 'INR')}\nStatus: ${tx.status}`);
  };

  const handleKeyDown = (e, tx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(tx);
    }
  };

  return (
    <Card title="Recent Transactions" className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-t-lg border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Transaction ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Card</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">No transactions yet</p>
                    <p className="text-xs text-slate-400">Your recent payments will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => handleRowClick(tx)}
                  onKeyDown={(e) => handleKeyDown(e, tx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View transaction ${tx.id} details`}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                >
                  <td className="px-6 py-4 font-mono text-slate-600 group-hover:text-blue-600 transition-colors">
                    {tx.id}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(tx.date).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm">
                        CARD
                      </div>
                      <span className="font-medium text-slate-700">•••• {tx.last4}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {formatCurrency(tx.amount, tx.currency || 'INR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      tx.status === 'Success' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        tx.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
