import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck,
  MessageSquare, 
  Heart, 
  Gift, 
  Bell, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from './FestiveIcons';
import { User, ActiveTab, ThemeMode, Group } from '../types';

interface SidebarProps {
  activeGroup?: Group | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  theme: ThemeMode;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  theme,
  activeGroup,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
  onLogout
}) => {
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Início', icon: Home },
    { id: 'groups' as ActiveTab, label: 'O meu Grupo', icon: Users },
    { id: 'participants' as ActiveTab, label: 'Participantes', icon: UserCheck },
    { 
      id: 'chat' as ActiveTab, 
      label: 'Chat', 
      icon: MessageSquare, 
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined 
    },
    { id: 'wishlist' as ActiveTab, label: 'Lista de Desejos', icon: Heart },
    { id: 'draw' as ActiveTab, label: 'Sorteio', icon: Gift, highlight: true },
    { 
      id: 'notifications' as ActiveTab, 
      label: 'Notificações', 
      icon: Bell, 
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined 
    },
    { id: 'settings' as ActiveTab, label: 'Definições', icon: Settings },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col justify-between p-4 shrink-0 h-full select-none transition-colors ${
      isDark 
        ? 'bg-[#081812] border-emerald-950/80 text-slate-100' 
        : 'bg-[#0d3427] border-emerald-950 text-white shadow-lg'
    }`}>
      {/* Brand Top */}
      <div className="space-y-5">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="cursor-pointer px-1 py-1"
        >
          <BrandLogo size="md" theme="dark" showTagline />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800/80 text-white font-bold border border-emerald-500/40 shadow-xs' 
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? 'text-amber-300' 
                      : item.highlight 
                        ? 'text-amber-400' 
                        : 'text-emerald-300/80'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.id === 'notifications' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Festive Quick Status Widget Reativo ao Estado Real */}
      {activeGroup ? (
        <div className="my-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm">🎁</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 truncate">
                {activeGroup.name}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-tight">
            Revelação: <strong>{activeGroup.drawDateFormatted || 'A definir'}</strong> • {activeGroup.members ? activeGroup.members.length : activeGroup.participantsCount} membros
          </p>
          <button
            onClick={() => setActiveTab('draw')}
            className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{activeGroup.status === 'drawn' ? 'Ver Sorteio Realizado' : 'Aceder ao Sorteio'}</span>
          </button>
        </div>
      ) : (
        <div className="my-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-100 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">✨</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Novo Sorteio
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-tight">
            Crie o seu grupo e convide amigos pelo WhatsApp!
          </p>
          <button
            onClick={() => setActiveTab('groups')}
            className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <span>+ Criar Primeiro Grupo</span>
          </button>
        </div>
      )}

      {/* User profile card at bottom */}
      <div className="pt-3 border-t border-emerald-900/60 flex items-center gap-2">
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex-1 flex items-center gap-3 p-2 rounded-xl border border-emerald-800/60 bg-emerald-950/60 hover:bg-emerald-900/80 cursor-pointer transition-all"
        >
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
          </div>

          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-bold truncate text-white">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-300">
                Online
              </span>
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Sair / Tela de Boas-Vindas"
            className="p-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/60 hover:bg-red-950/60 hover:border-red-800 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
