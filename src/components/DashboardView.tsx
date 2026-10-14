import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Gift, 
  Clock, 
  MoreVertical, 
  Sparkles, 
  Search, 
  Bell, 
  Plus, 
  KeyRound, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';
import { Group, User, AppNotification, ActiveTab, ThemeMode } from '../types';

interface DashboardViewProps {
  currentUser: User;
  groups: Group[];
  activeGroup?: Group | null;
  notifications: AppNotification[];
  theme: ThemeMode;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDraw: () => void;
  onSelectGroup: (group: Group) => void;
  onCreateGroup?: () => void;
  onJoinGroup?: () => void;
  wishlistCount?: number;
  messagesCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  groups,
  activeGroup: propActiveGroup,
  notifications,
  theme,
  setActiveTab,
  onOpenDraw,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  wishlistCount = 0,
  messagesCount = 0
}) => {
  const isDark = theme === 'dark';
  const hasGroups = groups.length > 0;
  const activeGroup = propActiveGroup || (hasGroups ? groups[0] : null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Live countdown calculating real time to drawDate
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!activeGroup?.drawDate) {
      return { days: 12, hours: 8, minutes: 30, seconds: 0 };
    }
    const target = new Date(activeGroup.drawDate).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const membersCount = activeGroup?.members ? activeGroup.members.length : (activeGroup?.participantsCount || 0);

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6 max-w-6xl mx-auto pb-10">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Bem-vindo, {currentUser.name.split(' ')[0]}!
            </h1>
            <span className="text-xl sm:text-2xl">✨</span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${
            isDark ? 'text-emerald-300/90' : 'text-slate-600'
          }`}>
            Organize o seu sorteio sem complicações com o Bilar Amigo Secreto.
          </p>
        </div>

        {/* Right side header tools */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto shrink-0">
          {/* Search Toggle */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar grupos..."
                  className={`w-40 sm:w-48 pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-emerald-800 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                <button 
                  onClick={() => { setShowSearchInput(false); setSearchTerm(''); }}
                  className={`ml-1 text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                title="Pesquisar"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-emerald-950/70 border-emerald-800/60 text-slate-300 hover:text-white hover:bg-emerald-900' 
                    : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Notifications Shortcut */}
          <button
            onClick={() => setActiveTab('notifications')}
            title="Notificações"
            className={`p-2 rounded-xl border transition-colors relative cursor-pointer ${
              isDark 
                ? 'bg-emerald-950/70 border-emerald-800/60 text-slate-300 hover:text-white hover:bg-emerald-900' 
                : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {/* Sorteio Direct CTA */}
          <button 
            onClick={onOpenDraw}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ver Sorteio</span>
          </button>
        </div>
      </div>

      {/* 2. Top Banner: SE NÃO HOUVER GRUPOS, MOSTRA BOAS-VINDAS REAL. SE HOUVER, MOSTRA GRUPO ATIVO */}
      {!activeGroup ? (
        <div className="relative rounded-3xl border border-emerald-800/60 p-6 sm:p-10 shadow-2xl text-center space-y-5 overflow-hidden bg-gradient-to-br from-[#071710] via-[#0b271d] to-[#1c080e] text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen scale-105 pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
          />
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-md">
            <Gift className="w-8 h-8 text-emerald-800 animate-bounce" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Comece Agora a Sua Experiência Real
            </span>
            <h2 className={`text-xl sm:text-2xl font-black font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Você ainda não tem nenhum grupo criado!
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Crie o seu primeiro grupo de amigos, família ou empresa, ou entre num grupo existente utilizando um código de convite.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={onCreateGroup}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all cursor-pointer border border-emerald-600"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Primeiro Grupo</span>
            </button>
            <button
              onClick={onJoinGroup}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer border border-slate-800"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Entrar com Código</span>
            </button>
          </div>

          {/* 3 Step Visual Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-left">
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">1</span>
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Crie o Grupo</h4>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Defina a ocasião, orçamento e regras do sorteio.</p>
            </div>
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">2</span>
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Convide no WhatsApp</h4>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Partilhe o código e link com apenas 1 clique.</p>
            </div>
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-1.5">3</span>
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sorteio 100% Secreto</h4>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cada pessoa descobre quem tirou com suspense e som!</p>
            </div>
          </div>
        </div>
      ) : (
        /* Top Split: Active Group Card + Live Countdown Timer */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Active Group Hero Card com Fundo de Presentes */}
          <div className="lg:col-span-7 rounded-2xl border border-emerald-700/60 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-xl bg-gradient-to-br from-[#0e3b2c] via-[#0b2f23] to-[#071e16] text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen scale-105 pointer-events-none"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
            />
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 min-w-0 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-lg shadow-md ring-2 ring-emerald-400/50">
                <Users className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    Grupo: {activeGroup.name}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 shrink-0">
                    {activeGroup.status === 'drawn' ? 'Sorteado ✓' : 'Ativo'}
                  </span>
                </div>

                <p className="text-xs text-emerald-200/90 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                  <span>{membersCount} participantes</span>
                  <span>•</span>
                  <span>Código: <strong className="font-mono text-amber-300">{activeGroup.code}</strong></span>
                  <span>•</span>
                  <span>Revelação: {activeGroup.drawDateFormatted || 'A definir'}</span>
                </p>

                <p className="text-xs text-emerald-100/70 mt-1 line-clamp-1">
                  {activeGroup.description || 'Troca de presentes com momentos especiais e muita amizade!'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-emerald-800/60 relative z-10">
              <div className="flex items-center -space-x-2 overflow-hidden">
                {activeGroup.members?.slice(0, 5).map((m, idx) => (
                  <img
                    key={idx}
                    src={m.avatar}
                    alt={m.name}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0b2f23] object-cover"
                  />
                ))}
                {membersCount > 5 && (
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full text-[10px] font-bold bg-emerald-600 text-white ring-2 ring-[#0b2f23]">
                    +{membersCount - 5}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onSelectGroup(activeGroup);
                  setActiveTab('groups');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Ver Grupo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Countdown Timer Card com Fundo de Presentes */}
          <div className="lg:col-span-5 rounded-2xl border border-red-800/60 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-xl bg-gradient-to-br from-[#300c0f] via-[#24080a] to-[#170406] text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen scale-105 pointer-events-none"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
            />
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-200">
                  Faltam para a revelação
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-300/80">
                {activeGroup?.drawDateFormatted || '15 Dezembro'}
              </span>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-4 gap-2 my-2 text-center">
              <div className="border border-red-700/40 rounded-xl p-2 bg-red-950/40">
                <span className="block text-xl sm:text-2xl font-black font-mono tabular-nums leading-tight text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold uppercase mt-0.5 block text-red-300">Dias</span>
              </div>

              <div className="border border-red-700/40 rounded-xl p-2 bg-red-950/40">
                <span className="block text-xl sm:text-2xl font-black font-mono tabular-nums leading-tight text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold uppercase mt-0.5 block text-red-300">Horas</span>
              </div>

              <div className="border border-red-700/40 rounded-xl p-2 bg-red-950/40">
                <span className="block text-xl sm:text-2xl font-black font-mono tabular-nums leading-tight text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold uppercase mt-0.5 block text-red-300">Min</span>
              </div>

              <div className="border border-amber-600/40 rounded-xl p-2 bg-amber-950/30">
                <span className="block text-xl sm:text-2xl font-black font-mono tabular-nums leading-tight text-amber-300 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold uppercase mt-0.5 block text-amber-300">Seg</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-red-900/60 text-red-200">
              <span>Orçamento: <strong>{activeGroup?.suggestedBudget || 3000} {activeGroup?.currency || 'MZN'}</strong></span>
              <button 
                onClick={onOpenDraw}
                className="text-amber-300 hover:text-white font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Aceder Sorteio</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Dynamic Real Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1: Participantes reais */}
        <div 
          onClick={() => setActiveTab('groups')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            isDark 
              ? 'bg-[#0a1813] border-emerald-900/60 hover:border-emerald-700' 
              : 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
            <Users className="w-5 h-5 text-emerald-800" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs block font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Grupos Ativos
            </span>
            <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {groups.length}
            </span>
          </div>
        </div>

        {/* 2: Mensagens reais */}
        <div 
          onClick={() => setActiveTab('chat')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            isDark 
              ? 'bg-[#0a1813] border-emerald-900/60 hover:border-emerald-700' 
              : 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
            <MessageSquare className="w-5 h-5 text-teal-800" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs block font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Mensagens Chat
            </span>
            <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {messagesCount}
            </span>
          </div>
        </div>

        {/* 3: Lista de desejos real */}
        <div 
          onClick={() => setActiveTab('wishlist')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            isDark 
              ? 'bg-[#0a1813] border-emerald-900/60 hover:border-emerald-700' 
              : 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
            <Heart className="w-5 h-5 text-rose-700" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs block font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Lista de Desejos
            </span>
            <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {wishlistCount} itens
            </span>
          </div>
        </div>

        {/* 4: Sorteio Real */}
        <div 
          onClick={onOpenDraw}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            isDark 
              ? 'bg-[#0a1813] border-emerald-900/60 hover:border-emerald-700' 
              : 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
            <Gift className="w-5 h-5 text-amber-800" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs block font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Estado Sorteio
            </span>
            <span className={`text-xs font-extrabold ${activeGroup?.status === 'drawn' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {activeGroup?.status === 'drawn' ? 'Realizado ✓' : hasGroups ? 'Pendente' : 'Sem Grupos'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. MAIN BOTTOM SECTION: ÚLTIMOS GRUPOS + NOTIFICAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Últimos Grupos */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-bold font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Os Seus Grupos
              </h2>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('groups')}
              className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of Group Cards or Clean Empty State */}
          <div className="space-y-3">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const count = group.members ? group.members.length : group.participantsCount;
                return (
                  <div
                    key={group.id}
                    onClick={() => {
                      onSelectGroup(group);
                      setActiveTab('groups');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                      isDark
                        ? 'bg-[#0a1813] border-emerald-900/60 hover:border-emerald-700 hover:bg-[#0c201a]'
                        : 'bg-white border-slate-300 hover:border-emerald-500 hover:shadow-md shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5 text-white" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-sm sm:text-base truncate ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {group.name}
                          </h3>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                            {group.code}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 font-medium ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {count} participantes • Revelação: {group.drawDateFormatted || 'A definir'}
                        </p>

                        {/* Avatars row in card */}
                        <div className="flex items-center -space-x-1.5 mt-2">
                          {group.members?.slice(0, 5).map((m, idx) => (
                            <img
                              key={idx}
                              src={m.avatar}
                              alt={m.name}
                              className={`w-6 h-6 rounded-full ring-2 object-cover ${isDark ? 'ring-slate-900' : 'ring-white'}`}
                            />
                          ))}
                          {count > 5 && (
                            <span className={`text-[10px] font-bold pl-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              +{count - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                      isDark ? 'border-emerald-950' : 'border-slate-200'
                    }`}>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        group.status === 'drawn'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {group.status === 'drawn' ? 'Sorteado ✓' : 'Pendente'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectGroup(group);
                          setActiveTab('groups');
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${
                isDark ? 'bg-[#0a1813] border-emerald-900/60 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-sm'
              }`}>
                <p className="text-xs font-medium">Nenhum grupo encontrado com os termos de pesquisa.</p>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={onCreateGroup || (() => setActiveTab('groups'))}
              className="py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-md bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-white font-black tracking-wide">Criar Novo Grupo</span>
            </button>

            <button
              onClick={onJoinGroup || (() => setActiveTab('groups'))}
              className="py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-md bg-slate-900 hover:bg-slate-800 text-white border border-slate-800"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-white font-black tracking-wide">Entrar no Grupo com Código</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Notificações */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
            isDark 
              ? 'bg-[#0a1813] border-emerald-900/60' 
              : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-emerald-950/80' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold font-display ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Notificações
                </h2>
                {notifications.some(n => !n.read) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                )}
              </div>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* List of Real Notifications */}
            <div className="space-y-3 py-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (notif.type === 'draw') onOpenDraw();
                      else if (notif.type === 'chat') setActiveTab('chat');
                      else if (notif.type === 'wishlist') setActiveTab('wishlist');
                      else setActiveTab('groups');
                    }}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
                      isDark ? 'border-emerald-900/40 hover:bg-emerald-950/40' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold">
                      {notif.type === 'draw' ? '🎉' : notif.type === 'chat' ? '💬' : notif.type === 'wishlist' ? '🎁' : '👥'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium leading-snug ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}>
                        <strong>{notif.title}</strong>: {notif.message}
                      </p>
                      <span className={`text-[10px] mt-1 block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  <span>Nenhuma notificação recente. As novidades dos seus grupos aparecerão aqui.</span>
                </div>
              )}
            </div>

            {/* Bottom link */}
            <div className={`pt-2 border-t text-center ${isDark ? 'border-emerald-950/80' : 'border-slate-200'}`}>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`text-xs font-bold hover:underline cursor-pointer ${
                  isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}
              >
                Ver todas as notificações ({notifications.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
