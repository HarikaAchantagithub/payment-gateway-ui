import React from 'react';

export function Button({ children, isLoading, className = '', ...props }) {
  return (
    <button
      className={`px-6 py-3 font-semibold text-white  bg-black rounded-lg hover:bg-gery-800 active:bg-gray-400  disabled:bg-gray-300 disabled:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
