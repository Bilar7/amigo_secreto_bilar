import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Gift, 
  Shuffle,
  Lock,
  Sparkles, 
  HelpCircle, 
  X, 
  Cake, 
  Briefcase, 
  PartyPopper, 
  TreePine,
  ArrowRight
} from 'lucide-react';
import { ChristmasCandle } from './FestiveIcons';
import { User, ThemeMode } from '../types';

interface WelcomeLandingViewProps {
  currentUser: User | null;
  theme?: ThemeMode;
  psychologyPalette?: 'vermelho' | 'esmeralda' | 'dourado';
  onChangePsychologyPalette?: (palette: 'vermelho' | 'esmeralda' | 'dourado') => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onEnterDraw?: () => void;
  onLoginSuccess?: (user: User) => void;
  onEnterApp?: () => void;
  onLogout?: () => void;
}

export const WelcomeLandingView: React.FC<WelcomeLandingViewProps> = ({
  currentUser,
  onCreateGroup,
  onJoinGroup,
  onOpenAuth,
  onEnterApp
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleStartGroup = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('signup');
    } else {
      onCreateGroup();
    }
  };

  const handleEnterPlatform = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
    } else {
      if (onEnterApp) onEnterApp();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* ========================================================================= */}
      {/* 1. HERO EXATAMENTE IGUAL À IMAGEM DE REFERÊNCIA (image_897416.png)         */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/70 bg-gradient-to-br from-[#07130d] via-[#050e09] to-[#0a1811] text-white">
        
        {/* Festive Nocturnal Atmospheric Background with Bokeh & Warm Lights */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-screen scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')`
          }}
        />

        {/* Warm Ambient Lights Accent */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content Grid */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge Bilar DigitalTech Solutions */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#c5a059]/40 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Bilar Amigo Secreto • Bilar DigitalTech Solutions</span>
              </div>

              {/* Main Headline — Exatamente como na imagem: "Mais que presentes, são ligações especiais." */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black leading-[1.12] tracking-tight font-serif text-balance">
                  <span className="block text-white">Mais que presentes,</span>
                  <span className="text-amber-300 drop-shadow-[0_2px_15px_rgba(251,191,36,0.45)]">
                    são ligações especiais.
                  </span>
                </h1>

                {/* Subtitle exatamente da imagem */}
                <p className="text-sm sm:text-base text-emerald-100/90 font-normal leading-relaxed max-w-xl">
                  Cria o teu grupo, escolhe os participantes, faz o sorteio e vive a magia do Amigo Secreto de forma simples, segura e divertida.
                </p>
              </div>

              {/* Action Buttons: Pílula Vermelha + Pílula com Borda Dourada exatamente como na imagem */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* 1. Criar Grupo (Red Pill) */}
                <button
                  onClick={handleStartGroup}
                  className="px-8 py-3.5 rounded-full bg-[#c4151c] hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-900/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-red-500/50 flex items-center gap-2"
                >
                  <span>Criar Grupo</span>
                </button>

                {/* 2. Entrar no Grupo (Gold Border Pill) */}
                <button
                  onClick={onJoinGroup}
                  className="px-8 py-3.5 rounded-full bg-black/40 hover:bg-black/60 border border-[#c5a059] text-white font-bold text-sm shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Entrar no Grupo</span>
                </button>

                {/* Ajuda Button */}
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="px-4 py-3 rounded-full text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Como Funciona?</span>
                </button>
              </div>
            </div>

            {/* Right Visual Column: Luxury Gift Boxes with Tag "Surpresas conectam pessoas." */}
            <div className="lg:col-span-5 flex items-center justify-center relative select-none mt-4 lg:mt-0">
              <div className="relative flex items-center justify-center">
                
                {/* Lit Candles flanking the composition */}
                <div className="absolute -left-6 sm:-left-8 bottom-4 z-20">
                  <ChristmasCandle className="w-8 h-20" />
                </div>
                <div className="absolute -right-4 sm:-right-6 bottom-2 z-20">
                  <ChristmasCandle className="w-7 h-16" />
                </div>

                {/* Luxury Wrapped Christmas Gift Box with Satin Red Ribbon & Kraft Tag */}
                <div 
                  onClick={handleEnterPlatform}
                  className="relative z-10 w-56 h-56 sm:w-68 sm:h-68 rounded-2xl bg-gradient-to-br from-[#122e20] via-[#0d2218] to-[#07130e] p-5 shadow-2xl border border-emerald-600/40 flex flex-col items-center justify-center cursor-pointer group hover:scale-102 transition-transform"
                >
                  {/* Real image overlay if present */}

                  {/* Red Satin Ribbons */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-b from-[#a81319] via-[#c4151c] to-[#800f13] shadow-md border-y border-red-400/40" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-[#a81319] via-[#c4151c] to-[#800f13] shadow-md border-x border-red-400/40" />

                  {/* Satin Bow on Top */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-9 h-5 rounded-[50%_20%_50%_20%] bg-gradient-to-br from-red-500 to-red-700 shadow-lg transform -rotate-25 origin-right border border-red-400/50" />
                    <div className="w-5 h-5 rounded-full bg-red-700 border border-amber-300 shadow-md z-10 mx-[-5px]" />
                    <div className="w-9 h-5 rounded-[20%_50%_20%_50%] bg-gradient-to-bl from-red-500 to-red-700 shadow-lg transform rotate-25 origin-left border border-red-400/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4 FLOATING GLASSMORPHIC CARDS (Exatamente como em image_897416.png)        */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-10 border-t border-emerald-900/40">
            {/* Card 1: Grupos Privados e Seguros */}
            <div 
              onClick={handleStartGroup}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-emerald-700/50 backdrop-blur-md transition-all hover:scale-102 cursor-pointer flex items-center gap-3 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  Grupos Privados e Seguros
                </h4>
                <p className="text-[11px] text-emerald-200/70 truncate">Acesso com código único</p>
              </div>
            </div>

            {/* Card 2: Chat Anónimo e Pessoal */}
            <div 
              onClick={handleEnterPlatform}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-emerald-700/50 backdrop-blur-md transition-all hover:scale-102 cursor-pointer flex items-center gap-3 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  Chat Anónimo e Pessoal
                </h4>
                <p className="text-[11px] text-emerald-200/70 truncate">Pistas estilo WhatsApp</p>
              </div>
            </div>

            {/* Card 3: Lista de Desejos e Presentes */}
            <div 
              onClick={handleEnterPlatform}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-emerald-700/50 backdrop-blur-md transition-all hover:scale-102 cursor-pointer flex items-center gap-3 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  Lista de Desejos e Presentes
                </h4>
                <p className="text-[11px] text-emerald-200/70 truncate">Links e preços reais (MZN)</p>
              </div>
            </div>

            {/* Card 4: Sorteio Automático e Justo */}
            <div 
              onClick={handleEnterPlatform}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-emerald-700/50 backdrop-blur-md transition-all hover:scale-102 cursor-pointer flex items-center gap-3 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                <Shuffle className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  Sorteio Automático e Justo
                </h4>
                <p className="text-[11px] text-emerald-200/70 truncate">Ciclo fechado inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODAL DE AJUDA / COMO FUNCIONA (Limpo e Completo)                      */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border shadow-2xl relative bg-white text-slate-900 border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                    Como Funciona o Bilar Amigo Secreto
                  </h3>
                  <p className="text-xs text-slate-500">
                    Guia simples em 4 passos para organizar o seu evento
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Content */}
            <div className="space-y-3.5 py-4 text-xs sm:text-sm text-left">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-0.5">Criar o Grupo e Partilhar no WhatsApp</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dê um nome ao grupo, escolha a data da revelação e defina o valor sugerido em Meticais (MZN). Partilhe o código de 6 letras ou o link de entrada direto com amigos pelo WhatsApp com 1 clique.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-0.5">Montar a Lista de Desejos com Fotos Reais</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cada participante adiciona sugestões de presentes com links de lojas reais, fotos e preços exatos, para que ninguém erre na hora de surpreender!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-0.5">Sorteio Automático e Sigiloso</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O organizador realiza o sorteio inteligente com garantia de ciclo fechado (ninguém tira a si mesmo). Cada um vê o seu amigo secreto com efeitos festivos e confetes!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-0.5">Chat Anônimo no WhatsApp do App</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Troque pistas sem se identificar pelo Bilar Conversas com as cores do WhatsApp e indicador de mensagem lida.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Bilar Amigo Secreto PRO • Bilar DigitalTech Solutions
              </span>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
