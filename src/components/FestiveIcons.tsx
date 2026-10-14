import React from 'react';
import { Gift, Sparkles, Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeMode } from '../types';

export const BrandLogo: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  theme?: ThemeMode;
  showTagline?: boolean;
}> = ({ 
  size = 'md', 
  theme = 'light',
  showTagline = false 
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center rounded-xl transition-all shadow-md ${
        isDark 
          ? 'bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950 border border-emerald-500/40 text-white' 
          : 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border border-emerald-500/30'
      } ${isSm ? 'w-8 h-8' : isLg ? 'w-11 h-11' : 'w-9 h-9'}`}>
        <Gift className={isSm ? 'w-4 h-4 text-emerald-100' : isLg ? 'w-6 h-6 text-emerald-100' : 'w-5 h-5 text-emerald-100'} />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
      </div>

      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight font-display ${
            isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg'
          } ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Bilar
          </span>
          <span className={`font-semibold tracking-tight ${
            isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'
          } ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Amigo Secreto
          </span>
        </div>
        {showTagline && (
          <span className={`text-[9px] font-bold tracking-wider mt-1 ${isDark ? 'text-emerald-400/90' : 'text-slate-500'}`}>
            BILARDIGITALTECH SOLUTIONS
          </span>
        )}
      </div>
    </div>
  );
};

export const ChristmasCandle: React.FC<{ className?: string }> = ({ className = "w-8 h-16" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-end ${className}`}>
      <div className="w-3.5 h-6 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse mb-0.5" />
      <div className="w-6 h-12 rounded-t bg-amber-100 border border-amber-300/40 shadow-sm" />
    </div>
  );
};

export const GiftBoxHero: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-[#c27803] via-[#92400e] to-[#6b2803] p-4 shadow-2xl border border-amber-400/40 flex flex-col items-center justify-center cursor-pointer group hover:scale-102 transition-transform"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-b from-red-600 via-red-500 to-red-700 shadow-md border-y border-red-400/40" />
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-9 bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-md border-x border-red-400/40" />

      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <div className="w-9 h-5 rounded-[50%_20%_50%_20%] bg-gradient-to-br from-red-500 to-red-700 shadow-lg transform -rotate-25 origin-right border border-red-400/50" />
        <div className="w-5 h-5 rounded-full bg-red-700 border border-amber-300 shadow-md z-10 mx-[-5px]" />
        <div className="w-9 h-5 rounded-[20%_50%_20%_50%] bg-gradient-to-bl from-red-500 to-red-700 shadow-lg transform rotate-25 origin-left border border-red-400/50" />
      </div>

      <div className="relative z-20 bg-amber-50 text-slate-900 rounded-lg px-3.5 py-2 shadow-lg border border-amber-300/80 transform rotate-[-3deg] group-hover:rotate-0 transition-transform text-center">
        <div className="text-[9px] uppercase font-bold tracking-widest text-red-700">Para Você</div>
        <div className="text-xs sm:text-sm font-black text-slate-800">Amigo Secreto</div>
        <div className="text-[11px] text-emerald-800 font-bold">Bilar DigitalTech ❤️</div>
      </div>
    </div>
  );
};

interface PwaInstallPromptProps {
  theme?: ThemeMode;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ theme = "light" }) => {
  const isDark = theme === "dark";
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const dismissed = localStorage.getItem("bilar_pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 1000 * 60 * 60 * 24 * 3) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (isIosDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShowPrompt(false);
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("bilar_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      <aside aria-label="Instalação do Aplicativo" className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in-up">
        <div className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 ${
          isDark 
            ? "bg-[#0a1813] border-emerald-600/80 text-white shadow-black/80" 
            : "bg-white border-emerald-500 text-slate-900 shadow-xl"
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-emerald-100" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm truncate">
                  Instalar no Celular
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-600 text-white">
                  App PWA
                </span>
              </div>
              <p className={`text-[11px] truncate mt-0.5 ${
                isDark ? "text-emerald-200/80" : "text-slate-600"
              }`}>
                Acesso rápido sem precisar de abrir o navegador!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>

            <button
              onClick={handleDismiss}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl space-y-4 text-center ${
            isDark ? "bg-[#0a1813] border-emerald-700 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Como instalar no iPhone / iPad</h3>
              <p className="text-xs text-slate-500 mt-1">Siga estes 2 passos rápidos no Safari:</p>
            </div>

            <div className="space-y-2.5 text-xs text-left">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2.5 border border-slate-200">
                <Share className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-slate-800">1. Toque no botão de <strong>Partilhar</strong> no Safari</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2.5 border border-slate-200">
                <PlusSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-800">2. Selecione <strong>Adicionar ao Ecrã Principal</strong></span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
