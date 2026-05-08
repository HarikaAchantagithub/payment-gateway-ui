import React from 'react';

export function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold text-slate-800 mb-6">{title}</h2>}
      {children}
    </div>
  );
}
