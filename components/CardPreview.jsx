import React from 'react';
import { formatCardNumber, formatExpiryDate } from '../utils/formatters';

export function CardPreview({ 
  cardNumber = '', 
  cardHolderName = '', 
  expiryDate = '', 
  cardType = 'generic',
  isFlipped = false,
  cvv = '',
  onCardClick
}) {
  const getMinimalBadge = () => {
    switch (cardType.toLowerCase()) {
      case 'visa': 
        return <span className="font-bold italic text-2xl tracking-tighter drop-shadow-sm">VISA</span>;
      case 'mastercard': 
        return (
          <div className="flex -space-x-3 drop-shadow-sm">
            <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
            <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-screen"></div>
          </div>
        );
      case 'amex': 
        return <span className="font-bold text-sm tracking-widest border border-white/50 px-2 py-0.5 rounded drop-shadow-sm">AMEX</span>;
      default: 
        return null;
    }
  };

  const getCardGradient = () => {
    switch (cardType.toLowerCase()) {
      case 'visa': return 'from-blue-800 to-blue-600';
      case 'mastercard': return 'from-gray-900 to-gray-700';
      case 'amex': return 'from-teal-800 to-teal-600';
      default: return 'from-slate-800 to-slate-900';
    }
  };

  return (
    <div 
      className="perspective-1000 w-full max-w-sm mx-auto h-56 relative mb-8 lg:mb-0 group cursor-pointer"
      onClick={onCardClick}
    >
      <div
        className={`w-full h-full transition-transform duration-700 preserve-3d absolute top-0 left-0 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className={`w-full h-full absolute top-0 left-0 backface-hidden bg-gradient-to-br ${getCardGradient()} rounded-2xl shadow-xl shadow-slate-200 p-6 text-white overflow-hidden flex flex-col justify-end border border-white/10 transition-colors duration-500`}>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-center relative z-10">
            {/* Chip icon */}
            
            <div className="h-8 flex items-center">
              {getMinimalBadge()}
            </div>
          </div>

          <div className="relative z-10 space-y-5">
            <div className="text-2xl tracking-widest font-mono text-shadow-sm flex justify-between">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span>1283</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[9px] text-white/60 uppercase tracking-widest mb-1">Card Holder</span>
                <span className="font-medium tracking-widest truncate max-w-[180px] uppercase text-sm drop-shadow-sm">
                  HARIKA ACHANTA
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-white/60 uppercase tracking-widest mb-1">Expires</span>
                <span className="font-medium tracking-widest drop-shadow-sm">
                  10/32
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className={`w-full h-full absolute top-0 left-0 backface-hidden rotate-y-180 bg-gradient-to-br ${getCardGradient()} rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-white/10 transition-colors duration-500`}>
          <div className="w-full h-12 bg-black/80 mt-6 relative z-20"></div>
          <div className="p-6 mt-2 relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="flex flex-col items-end relative z-10">
              <span className="text-[10px] text-white/80 uppercase tracking-wider mb-1 pr-1">CVV</span>
              <div className="bg-white w-full h-10 rounded text-right pr-4 flex items-center justify-end text-slate-800 font-mono tracking-widest italic shadow-inner">
                622
              </div>
            </div>
            <p className="text-[8px] text-white/40 mt-4 leading-relaxed font-medium">
              This card is for demo purposes only. Please do not provide real financial information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
