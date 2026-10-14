import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  Briefcase,
  Cake,
  PartyPopper,
  TreePine,
  Lock,
  Search,
  KeyRound,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Heart,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ActiveTab, Group, User, ThemeMode, GroupOccasion } from '../types';

interface GroupsViewProps {
  groups: Group[];
  currentUser: User;
  theme: ThemeMode;
  onCreateGroup: () => void;
  onJoinGroup?: () => void;
  onSelectGroup: (group: Group, targetTab?: ActiveTab) => void;
  onTriggerDraw: (groupId: string) => void;
  onShareGroup?: (group: Group) => void;
}

type FilterOption = 'all' | 'admin' | 'ready' | 'drawn' | 'pending';

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  currentUser,
  theme,
  onCreateGroup,
  onJoinGroup,
  onSelectGroup,
  onTriggerDraw,
  onShareGroup
}) => {
  const isDark = theme === 'dark';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const minMembersRequired = 3;

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOccasionConfig = (occ: GroupOccasion) => {
    switch (occ) {
      case 'natal':
        return {
          label: 'Natal & Boas Festas',
          icon: TreePine,
          accentBg: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300',
          badgeColor: 'text-emerald-400',
          cardGlow: 'from-emerald-950/40 to-slate-900/40'
        };
      case 'empresa':
        return {
          label: 'Empresa & Colegas',
          icon: Briefcase,
          accentBg: 'bg-blue-950/70 border-blue-700/60 text-blue-300',
          badgeColor: 'text-blue-400',
          cardGlow: 'from-blue-950/40 to-slate-900/40'
        };
      case 'aniversario':
        return {
          label: 'Aniversário & Celebração',
          icon: Cake,
          accentBg: 'bg-pink-950/70 border-pink-700/60 text-pink-300',
          badgeColor: 'text-pink-400',
          cardGlow: 'from-pink-950/40 to-slate-900/40'
        };
      case 'fim_ano':
        return {
          label: 'Fim de Ano & Réveillon',
          icon: PartyPopper,
          accentBg: 'bg-amber-950/70 border-amber-700/60 text-amber-300',
          badgeColor: 'text-amber-400',
          cardGlow: 'from-amber-950/40 to-slate-900/40'
        };
      default:
        return {
          label: 'Amigos & Família',
          icon: Users,
          accentBg: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300',
          badgeColor: 'text-emerald-400',
          cardGlow: 'from-emerald-950/40 to-slate-900/40'
        };
    }
  };

  // Metrics calculations
  const totalGroups = groups.length;
  const adminGroups = groups.filter(g => g.adminId === currentUser.id).length;
  const drawnGroups = groups.filter(g => g.status === 'drawn').length;
  const readyGroups = groups.filter(g => {
    const membersCount = g.members ? g.members.length : g.participantsCount;
    return g.status !== 'drawn' && membersCount >= minMembersRequired;
  }).length;
  const pendingGroups = groups.filter(g => {
    const membersCount = g.members ? g.members.length : g.participantsCount;
    return g.status !== 'drawn' && membersCount < minMembersRequired;
  }).length;

  // Filtered and searched groups
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      // Search
      const matchesSearch = 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter
      const membersCount = group.members ? group.members.length : group.participantsCount;
      const isAdmin = group.adminId === currentUser.id;
      const isDrawn = group.status === 'drawn';
      const isReady = !isDrawn && membersCount >= minMembersRequired;
      const isPending = !isDrawn && membersCount < minMembersRequired;

      if (activeFilter === 'admin') return isAdmin;
      if (activeFilter === 'drawn') return isDrawn;
      if (activeFilter === 'ready') return isReady;
      if (activeFilter === 'pending') return isPending;
      return true;
    });
  }, [groups, searchQuery, activeFilter, currentUser.id]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header Banner & Hero Section com Fundo de Presentes */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-[#0c2419] via-[#091510] to-[#1a080e] p-5 sm:p-7 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
        />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-[11px] font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Painel Central de Grupos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Os Meus Grupos de Amigo Secreto
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              Organize os seus eventos privados, convide participantes e acompanhe cada sorteio num só lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onJoinGroup && (
              <button
                onClick={onJoinGroup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600/60 bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 hover:text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Entrar com Código</span>
              </button>
            )}

            <button
              onClick={onCreateGroup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-700/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Grupo</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-5 pt-5 border-t border-emerald-900/50">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 backdrop-blur-xs">
            <div className="flex items-center justify-between text-emerald-300/80 text-[11px]">
              <span>Os Meus Grupos</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              {totalGroups}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 backdrop-blur-xs">
            <div className="flex items-center justify-between text-amber-300/80 text-[11px]">
              <span>Organizador</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1">
              {adminGroups}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 backdrop-blur-xs">
            <div className="flex items-center justify-between text-teal-300/80 text-[11px]">
              <span>Prontos p/ Sortear</span>
              <Gift className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-300 mt-1">
              {readyGroups}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 backdrop-blur-xs">
            <div className="flex items-center justify-between text-purple-300/80 text-[11px]">
              <span>Sorteios Feitos</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300 mt-1">
              {drawnGroups}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome do grupo ou código..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Rules Banner Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 self-start md:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Regra de sorteio: Mínimo <strong>3 membros</strong> e apenas o <strong>organizador</strong> pode sortear.</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            Todos ({totalGroups})
          </button>

          <button
            onClick={() => setActiveFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Onde sou Organizador ({adminGroups})</span>
          </button>

          <button
            onClick={() => setActiveFilter('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'ready'
                ? 'bg-emerald-700 text-white shadow-xs'
                : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-emerald-300" />
            <span>Prontos para Sortear ({readyGroups})</span>
          </button>

          <button
            onClick={() => setActiveFilter('drawn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'drawn'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Sorteio Concluído ({drawnGroups})</span>
          </button>

          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark ? 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>Aguardando Membros ({pendingGroups})</span>
          </button>
        </div>
      </div>

      {/* 3. Group Grid - Beautiful, Balanced, and Responsive Cards */}
      {filteredGroups.length === 0 ? (
        <div className={`rounded-3xl border border-dashed p-10 text-center space-y-3 ${isDark ? "border-slate-800 bg-slate-950/40 text-slate-300" : "border-slate-300 bg-white text-slate-700 shadow-xs"}`}>
          <div className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center ${isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
            <Users className="w-7 h-7" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Nenhum grupo encontrado</h3>
          <p className={`text-xs max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {searchQuery 
              ? `Não foram encontrados grupos correspondentes a "${searchQuery}".`
              : 'Não há grupos nesta categoria no momento.'}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Limpar Pesquisa
              </button>
            )}
            <button
              onClick={onCreateGroup}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs"
            >
              Criar Novo Grupo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredGroups.map((group) => {
            const isDrawn = group.status === 'drawn';
            const isAdmin = group.adminId === currentUser.id;
            const currentMembersCount = group.members ? group.members.length : group.participantsCount;
            const hasEnoughMembers = currentMembersCount >= minMembersRequired;
            const occConfig = getOccasionConfig(group.occasion);
            const OccasionIcon = occConfig.icon;
            const percentFilled = Math.min(100, Math.round((currentMembersCount / group.maxParticipants) * 100));

            return (
              <div
                key={group.id}
                className={`group relative rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isDark 
                    ? 'bg-gradient-to-b from-slate-900/90 to-[#0a1610]/90 border-slate-800/90 hover:border-emerald-700/60 shadow-lg hover:shadow-xl hover:shadow-emerald-950/30' 
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Decorative Top Occasion Banner Stripe */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${
                  isDrawn 
                    ? 'from-purple-500 via-amber-500 to-emerald-500' 
                    : hasEnoughMembers 
                      ? 'from-emerald-500 via-teal-500 to-green-400' 
                      : 'from-blue-500 via-indigo-500 to-slate-600'
                }`} />

                {/* Card Main Body */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Occasion Pill */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold ${occConfig.accentBg}`}>
                        <OccasionIcon className="w-3.5 h-3.5" />
                        <span>{occConfig.label}</span>
                      </span>

                      {/* Admin or Member Pill */}
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>Organizador</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                          <span>Membro</span>
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      isDrawn 
                        ? 'bg-purple-950/80 text-purple-300 border-purple-700/70 shadow-xs shadow-purple-950' 
                        : hasEnoughMembers
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                          : 'bg-blue-950/80 text-blue-300 border-blue-700/70'
                    }`}>
                      {isDrawn 
                        ? '✨ Sorteio Concluído' 
                        : hasEnoughMembers 
                          ? '🎯 Pronto para Sortear' 
                          : `⏳ Faltam ${minMembersRequired - currentMembersCount} para Sortear`}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold font-display leading-tight truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {group.name}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {group.description}
                    </p>
                  </div>

                  {/* Specs & Metrics Grid */}
                  <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl text-center border ${isDark ? "bg-slate-950/50 border-slate-800/70 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"}`}>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" />
                        <span>Membros</span>
                      </span>
                      <p className={`text-xs sm:text-sm font-bold font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
                        {currentMembersCount}/{group.maxParticipants}
                      </p>
                    </div>

                    <div className="space-y-0.5 border-x border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span>Sorteio</span>
                      </span>
                      <p className={`text-xs sm:text-sm font-bold truncate px-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {group.drawDateFormatted}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <DollarSign className="w-3 h-3 text-amber-400" />
                        <span>Orçamento</span>
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                        {group.suggestedBudget} {group.currency}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar of Capacity */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Capacidade do grupo: {percentFilled}%</span>
                      <span>{currentMembersCount} de {group.maxParticipants} vagas</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          hasEnoughMembers 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>

                  {/* Participants Avatar Stack & Invite Code Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Avatars */}
                    <div className="flex items-center -space-x-2 overflow-hidden py-1">
                      {group.members?.slice(0, 5).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={m.name}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                        />
                      ))}
                      {currentMembersCount > 5 && (
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-200 ring-2 ring-slate-900 border border-emerald-700/60">
                          +{currentMembersCount - 5}
                        </span>
                      )}
                    </div>

                    {/* Code Badge with Quick Copy - RESTRICTED TO CREATOR ONLY */}
                    {isAdmin ? (
                      <button
                        onClick={(e) => handleCopyCode(group.code, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${isDark ? "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"}`}
                        title="Copiar código do grupo (Apenas Organizador)"
                      >
                        <span className="text-slate-400 text-[10px]">Cód:</span>
                        <strong className="text-emerald-300">{group.code}</strong>
                        {copiedCode === group.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400">
                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Convites pelo criador</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className={`p-3 sm:p-4 border-t flex flex-wrap items-center justify-between gap-2 ${
                  isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  {/* Left: Share & Details - ONLY CREATOR CAN INVITE */}
                  <div className="flex items-center gap-1.5">
                    {onShareGroup && isAdmin && (
                      <button
                        onClick={() => onShareGroup(group)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-emerald-800/60 bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 hover:text-white text-xs font-semibold transition-all"
                        title="Partilhar convite no WhatsApp ou redes (Apenas Organizador)"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Convidar</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectGroup(group, 'participants')}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                      title="Gerir participantes deste grupo"
                    >
                      <span>Participantes ({currentMembersCount})</span>
                    </button>

                    <button
                      onClick={() => onSelectGroup(group, 'chat')}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-emerald-400 hover:text-white' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-emerald-700'
                      }`}
                      title="Abrir chat do grupo"
                    >
                      <span>Chat</span>
                    </button>
                  </div>

                  {/* Right: Primary Draw State Button */}
                  <div>
                    {isDrawn ? (
                      <button
                        onClick={() => onSelectGroup(group)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-amber-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Ver Meu Amigo</span>
                      </button>
                    ) : isAdmin ? (
                      hasEnoughMembers ? (
                        <button
                          onClick={() => onTriggerDraw(group.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-red-950/60 hover:shadow-red-600/30 active:scale-95"
                        >
                          <Gift className="w-3.5 h-3.5 animate-bounce" />
                          <span>Realizar Sorteio</span>
                        </button>
                      ) : (
                        <div 
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                          title={`Necessário pelo menos ${minMembersRequired} membros para sortear`}
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Faltam {minMembersRequired - currentMembersCount} membro(s)</span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
                        <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Aguardando Sorteio</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Comprehensive Group Detail Modal */}
      {selectedGroupDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedGroupDetails(null)}
        >
          <div 
            className={`w-full max-w-xl my-auto rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#091510] border-emerald-800/80 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-md">
                  <Gift className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display">
                    {selectedGroupDetails.name}
                  </h3>
                  {selectedGroupDetails.adminId === currentUser.id ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-emerald-400/90 font-mono font-bold">
                        Código: {selectedGroupDetails.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(selectedGroupDetails.code)}
                        className="text-[10px] text-emerald-300 hover:text-white underline"
                      >
                        {copiedCode === selectedGroupDetails.code ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      🔒 Código de convite restrito ao criador
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedGroupDetails(null)}
                className="w-8 h-8 rounded-full bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
              <span className="text-[11px] font-semibold text-emerald-300 block mb-1">Sobre este grupo:</span>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {selectedGroupDetails.description}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs block font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Data Prevista da Revelação</span>
                <span className={`font-bold text-sm mt-1 block ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedGroupDetails.drawDateFormatted}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs block font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Teto do Orçamento</span>
                <span className="font-bold text-sm text-amber-400 mt-1 block font-mono">
                  {selectedGroupDetails.suggestedBudget} {selectedGroupDetails.currency}
                </span>
              </div>
            </div>

            {/* Registered Members List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Participantes Inscritos ({selectedGroupDetails.members ? selectedGroupDetails.members.length : selectedGroupDetails.participantsCount})</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Máximo: {selectedGroupDetails.maxParticipants}
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedGroupDetails.members?.map((m) => {
                  const isMemberAdmin = selectedGroupDetails.adminId === m.id;
                  const isCurrent = currentUser.id === m.id;

                  return (
                    <div 
                      key={m.id} 
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                        isDark ? 'bg-slate-900/70 border-slate-800/80 hover:border-emerald-700/50' : 'bg-slate-50 border-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={m.avatar} 
                          alt={m.name} 
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-950 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {m.name} {isCurrent && '(Você)'}
                            </span>
                            {isMemberAdmin && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Organizador
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {m.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 font-medium shrink-0">
                        <Heart className="w-3 h-3 text-red-400 fill-red-400/40" />
                        <span>{m.wishlistCount} desejos</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Share Banner inside modal - RESTRICTED TO CREATOR ONLY */}
            {selectedGroupDetails.adminId === currentUser.id ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">Queres convidar mais participantes?</span>
                  <span className="text-[11px] text-emerald-300/80">Como criador, partilha o código {selectedGroupDetails.code}</span>
                </div>
                {onShareGroup && (
                  <button
                    onClick={() => {
                      const g = selectedGroupDetails;
                      setSelectedGroupDetails(null);
                      onShareGroup(g);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    Partilhar
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Apenas o organizador do grupo tem permissão para convidar novos participantes.</span>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-emerald-900/60">
              <button
                onClick={() => setSelectedGroupDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Fechar
              </button>

              {selectedGroupDetails.status === 'drawn' ? (
                <button
                  onClick={() => {
                    const g = selectedGroupDetails;
                    setSelectedGroupDetails(null);
                    onSelectGroup(g);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ver Meu Amigo</span>
                </button>
              ) : selectedGroupDetails.adminId === currentUser.id && (selectedGroupDetails.members?.length || selectedGroupDetails.participantsCount) >= minMembersRequired ? (
                <button
                  onClick={() => {
                    const gId = selectedGroupDetails.id;
                    setSelectedGroupDetails(null);
                    onTriggerDraw(gId);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Realizar Sorteio Agora</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
