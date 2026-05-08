import React from 'react';

export function Input({ label, error, className = '', id, required = false, ...props }) {
  const inputId = id || props.name;
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input
        id={inputId}
        className={`px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200
          ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200 hover:border-slate-300'}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <span id={errorId} className="text-xs text-red-500 mt-1 font-medium animate-in slide-in-from-top-1 fade-in duration-200">{error}</span>}
    </div>
  );
}
