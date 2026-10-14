import React from 'react';

interface IllustrationProps {
  type: string;
  className?: string;
}

export const ProductIllustration: React.FC<IllustrationProps> = ({ type, className = "w-full h-full" }) => {
  switch (type) {
    case 'headphones':
      return (
        <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
          <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 drop-shadow-xl" fill="none">
            {/* Headband */}
            <path d="M20 52 C20 24 80 24 80 52" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M23 48 C23 28 77 28 77 48" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            {/* Cushion */}
            <path d="M32 30 C32 26 68 26 68 30" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            {/* Left Cup */}
            <rect x="14" y="48" width="16" height="30" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <rect x="18" y="52" width="8" height="22" rx="4" fill="#0f172a" />
            <circle cx="22" cy="63" r="2.5" fill="#e11d48" />
            {/* Right Cup */}
            <rect x="70" y="48" width="16" height="30" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <rect x="74" y="52" width="8" height="22" rx="4" fill="#0f172a" />
            <circle cx="78" cy="63" r="2.5" fill="#e11d48" />
          </svg>
        </div>
      );

    case 'book':
      return (
        <div className={`relative flex items-center justify-center bg-[#f7f3e8] rounded-xl p-4 overflow-hidden border border-amber-900/10 ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#fcf9f2] to-[#e8dec8]" />
          <div className="relative z-10 w-24 h-32 bg-[#faf6eb] shadow-lg rounded-r-md border-l-4 border-amber-900/40 p-2.5 flex flex-col justify-between text-center">
            <div className="border-b border-amber-900/20 pb-1">
              <span className="text-[7px] uppercase font-bold tracking-widest text-amber-800">Bestseller</span>
            </div>
            <div className="my-auto">
              <div className="w-8 h-8 mx-auto rounded-full border border-amber-800/30 flex items-center justify-center mb-1">
                <span className="text-[10px] text-amber-800">⚛️</span>
              </div>
              <h4 className="text-[10px] font-black leading-tight text-amber-950 uppercase tracking-tight">HÁBITOS ATÓMICOS</h4>
              <p className="text-[7px] text-amber-800 mt-0.5">James Clear</p>
            </div>
            <div className="border-t border-amber-900/20 pt-1">
              <span className="text-[6px] text-amber-900/60 font-medium">Mudanças Pequenas</span>
            </div>
          </div>
        </div>
      );

    case 'watch':
      return (
        <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
          <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 drop-shadow-xl" fill="none">
            {/* Strap */}
            <rect x="36" y="8" width="28" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="36" y="68" width="28" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Watch Case */}
            <rect x="28" y="26" width="44" height="48" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />
            {/* Screen */}
            <rect x="34" y="34" width="32" height="32" rx="4" fill="#99f6e4" fillOpacity="0.15" stroke="#14b8a6" strokeWidth="1" />
            {/* LCD Digits */}
            <text x="50" y="52" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontWeight="bold" fontFamily="monospace">10:58</text>
            <text x="50" y="60" textAnchor="middle" fill="#0d9488" fontSize="6" fontFamily="monospace">CASIO 50M</text>
            {/* Buttons */}
            <rect x="24" y="34" width="4" height="8" rx="1" fill="#64748b" />
            <rect x="24" y="50" width="4" height="8" rx="1" fill="#64748b" />
            <rect x="72" y="34" width="4" height="8" rx="1" fill="#64748b" />
            <rect x="72" y="50" width="4" height="8" rx="1" fill="#64748b" />
          </svg>
        </div>
      );

    case 'perfume':
      return (
        <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900" />
          <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 drop-shadow-2xl" fill="none">
            {/* Cap */}
            <rect x="41" y="16" width="18" height="18" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <line x1="42" y1="21" x2="58" y2="21" stroke="#334155" strokeWidth="1" />
            <line x1="42" y1="25" x2="58" y2="25" stroke="#334155" strokeWidth="1" />
            <line x1="42" y1="29" x2="58" y2="29" stroke="#334155" strokeWidth="1" />
            {/* Spray Ring */}
            <rect x="44" y="33" width="12" height="4" fill="#94a3b8" />
            {/* Bottle */}
            <rect x="32" y="36" width="36" height="52" rx="8" fill="url(#perfumeGrad)" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.4" />
            {/* Label */}
            <text x="50" y="58" textAnchor="middle" fill="#f8fafc" fontSize="6.5" fontWeight="900" letterSpacing="1">SAUVAGE</text>
            <text x="50" y="65" textAnchor="middle" fill="#94a3b8" fontSize="4.5" letterSpacing="1.5">Dior</text>
            <defs>
              <linearGradient id="perfumeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'backpack':
      return (
        <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
          <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 drop-shadow-xl" fill="none">
            {/* Handle */}
            <path d="M42 22 C42 16 58 16 58 22" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            {/* Main body */}
            <path d="M28 35 C28 22 72 22 72 35 L76 78 C76 84 72 88 64 88 L36 88 C28 88 24 84 24 78 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            {/* Front Pocket */}
            <rect x="32" y="48" width="36" height="32" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Zipper Lines */}
            <line x1="36" y1="44" x2="64" y2="44" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 1" />
            <line x1="36" y1="56" x2="64" y2="56" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
            {/* Subtle logo */}
            <rect x="47" y="68" width="6" height="4" rx="1" fill="#e11d48" />
          </svg>
        </div>
      );

    case 'smartwatch':
      return (
        <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
          <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 drop-shadow-xl" fill="none">
            {/* Strap */}
            <rect x="38" y="10" width="24" height="22" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="38" y="68" width="24" height="22" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            {/* Body */}
            <rect x="34" y="24" width="32" height="52" rx="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            {/* AMOLED Screen */}
            <rect x="38" y="28" width="24" height="44" rx="10" fill="#000000" />
            {/* Display Elements */}
            <text x="50" y="44" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">09:42</text>
            <text x="50" y="52" textAnchor="middle" fill="#ef4444" fontSize="5">❤️ 76 bpm</text>
            <rect x="42" y="58" width="16" height="2.5" rx="1" fill="#22c55e" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center bg-emerald-950/40 rounded-xl p-4 overflow-hidden border border-emerald-800/30 ${className}`}>
          <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/40 text-2xl">
            🎁
          </div>
        </div>
      );
  }
};
