import React from 'react';
import { BrandLogo } from './FestiveIcons';
import { Sun, Moon, LogOut } from 'lucide-react';
import { User, ActiveTab, ThemeMode } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  colorScheme?: 'natal' | 'esmeralda' | 'dourado';
  onChangeColorScheme?: (scheme: 'natal' | 'esmeralda' | 'dourado') => void;
  psychologyPalette?: 'vermelho' | 'esmeralda' | 'dourado';
  onChangePsychologyPalette?: (palette: 'vermelho' | 'esmeralda' | 'dourado') => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  isMobilePreview?: boolean;
  setIsMobilePreview?: (val: boolean) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onLogout
}) => {
  const isLight = theme === 'light';
  const isLanding = activeTab === 'landing' || !currentUser;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md px-3 sm:px-8 py-3 transition-colors duration-300 border-b ${
      isLanding
        ? 'bg-[#07130d]/95 text-white border-emerald-950/80 shadow-md'
        : isLight 
          ? 'bg-white/95 text-slate-900 border-slate-300 shadow-xs' 
          : 'bg-[#091712]/95 text-slate-100 border-emerald-950/70 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark: Bilar Amigo Secreto */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')}
          className="cursor-pointer shrink-0 flex items-center gap-2 group"
          title={currentUser ? "Ir para Início" : "Ver Tela de Boas-Vindas"}
        >
          <BrandLogo size="md" theme={isLanding ? 'dark' : theme} showTagline />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className={`hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold ${
          isLanding 
            ? 'text-emerald-100/90' 
            : isLight ? 'text-slate-700' : 'text-emerald-100/85'
        }`}>
          {isLanding ? (
            /* Links on Landing Page */
            <>
              <button 
                onClick={() => setActiveTab('landing')}
                className="transition-colors whitespace-nowrap text-white font-bold border-b-2 border-red-500 pb-0.5 cursor-pointer"
              >
                Início
              </button>

              <button 
                onClick={() => {
                  setActiveTab('landing');
                  window.dispatchEvent(new CustomEvent('open-help-modal'));
                }}
                className="transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer"
              >
                Como Funciona
              </button>

              <button 
                onClick={() => setActiveTab('landing')}
                className="transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer"
              >
                Recursos
              </button>

              <button 
                onClick={() => setActiveTab('landing')}
                className="transition-colors whitespace-nowrap hover:text-amber-300 cursor-pointer"
              >
                Testemunhos
              </button>
            </>
          ) : (
            /* Inside App: Início, Sorteio, Grupos, Chat, Lista de Desejos */
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? isLight 
                      ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700 pb-0.5' 
                      : 'text-white font-bold border-b-2 border-emerald-500 pb-0.5' 
                    : isLight ? 'hover:text-emerald-800' : 'hover:text-white'
                }`}
              >
                Início
              </button>

              <button 
                onClick={() => setActiveTab('draw')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'draw' 
                    ? isLight 
                      ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700 pb-0.5' 
                      : 'text-white font-bold border-b-2 border-emerald-500 pb-0.5' 
                    : isLight ? 'hover:text-emerald-800' : 'hover:text-white'
                }`}
              >
                Sorteio
              </button>

              <button 
                onClick={() => setActiveTab('groups')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'groups' 
                    ? isLight 
                      ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700 pb-0.5' 
                      : 'text-white font-bold border-b-2 border-emerald-500 pb-0.5' 
                    : isLight ? 'hover:text-emerald-800' : 'hover:text-white'
                }`}
              >
                Grupos
              </button>

              <button 
                onClick={() => setActiveTab('chat')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'chat' 
                    ? isLight 
                      ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700 pb-0.5' 
                      : 'text-white font-bold border-b-2 border-emerald-500 pb-0.5' 
                    : isLight ? 'hover:text-emerald-800' : 'hover:text-white'
                }`}
              >
                Chat
              </button>

              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'wishlist' 
                    ? isLight 
                      ? 'text-emerald-800 font-extrabold border-b-2 border-emerald-700 pb-0.5' 
                      : 'text-white font-bold border-b-2 border-emerald-500 pb-0.5' 
                    : isLight ? 'hover:text-emerald-800' : 'hover:text-white'
                }`}
              >
                Lista de Desejos
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={isLight ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
              isLanding
                ? 'bg-black/40 text-amber-300 border border-emerald-700/60 hover:bg-black/60'
                : isLight 
                  ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200' 
                  : 'bg-emerald-950/80 text-amber-300 border border-emerald-800/60 hover:bg-emerald-900/80'
            }`}
          >
            {isLight && !isLanding ? (
              <>
                <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="hidden md:inline font-bold">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-300" />
                <span className="hidden md:inline font-bold">Escuro</span>
              </>
            )}
          </button>

          {/* User Profile or Red Entrar Pill Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-300 hover:border-slate-400 shadow-xs'
                    : 'bg-emerald-950/70 border-emerald-800/60 hover:border-emerald-600'
                }`}
                title="Ver perfil e definições"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <span className={`text-xs font-bold hidden sm:inline ${
                  isLanding ? 'text-white' : isLight ? 'text-slate-900' : 'text-emerald-100'
                }`}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sair para Tela de Boas-Vindas"
                  className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                    isLanding
                      ? 'bg-black/40 border-emerald-700/60 text-slate-300 hover:text-white'
                      : isLight
                        ? 'bg-white border-slate-300 hover:bg-red-50 text-slate-600 hover:text-red-600'
                        : 'bg-emerald-950/70 border-emerald-800/60 hover:bg-red-950/60 hover:border-red-800 text-slate-400 hover:text-red-400'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="px-6 py-2 text-xs font-bold text-white bg-[#c4151c] hover:bg-red-700 rounded-full shadow-md shadow-red-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-red-500/50"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
