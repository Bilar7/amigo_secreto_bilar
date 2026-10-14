import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  Heart, 
  Copy, 
  Check, 
  ShieldCheck, 
  Trash2, 
  Share2, 
  Gift, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Group, User, ActiveTab, ThemeMode } from '../types';

interface ParticipantsViewProps {
  activeGroup?: Group | null;
  groups?: Group[];
  currentUser: User;
  theme: ThemeMode;
  onNavigateToWishlist: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onAddMember?: (groupId: string, memberName: string, memberEmail: string) => void;
  onRemoveMember?: (groupId: string, memberId: string) => void;
  onSelectGroup?: (group: Group) => void;
  onShareGroup?: (group: Group) => void;
}

export const ParticipantsView: React.FC<ParticipantsViewProps> = ({
  activeGroup,
  groups,
  currentUser,
  theme,
  onNavigateToWishlist,
  setActiveTab,
  onAddMember,
  onRemoveMember,
  onSelectGroup,
  onShareGroup
}) => {
  const isDark = theme === 'dark';
  const [copiedLink, setCopiedLink] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addFeedback, setAddFeedback] = useState('');

  if (!activeGroup) {
    return (
      <div className={`p-8 rounded-3xl border text-center space-y-4 shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-sm'
      }`}>
        <Users className="w-12 h-12 mx-auto text-emerald-600" />
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Nenhum grupo ativo selecionado
        </h3>
        <p className="text-xs max-w-md mx-auto">
          Crie ou entre num grupo primeiro para gerir e ver os participantes reais.
        </p>
        <button
          onClick={() => setActiveTab('groups')}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all cursor-pointer"
        >
          Ver Os Meus Grupos
        </button>
      </div>
    );
  }

  const isAdmin = currentUser.id === activeGroup.adminId;
  const members = activeGroup.members || [];
  const membersCount = members.length;
  const isDrawn = activeGroup.status === 'drawn';

  const handleCopyInviteLink = () => {
    const inviteUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}?join=${activeGroup.code}` 
      : `https://bilar-amigo-secreto.app?join=${activeGroup.code}`;
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    if (onAddMember) {
      onAddMember(activeGroup.id, newMemberName.trim(), newMemberEmail.trim());
      setAddFeedback(`"${newMemberName.trim()}" adicionado com sucesso!`);
      setNewMemberName('');
      setNewMemberEmail('');
      setTimeout(() => setAddFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Group Switcher Strip se houver mais de um grupo */}
      {groups && groups.length > 1 && (
        <div className={`p-3 rounded-2xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Gerir Participantes de:</span>
            </span>
            <span className="text-[11px] text-slate-500">Toque para trocar de grupo</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {groups.map((g) => {
              const isSelected = activeGroup.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => onSelectGroup && onSelectGroup(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Participantes ({membersCount}/{activeGroup.maxParticipants})
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
              Cód: {activeGroup.code}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Grupo: <strong>{activeGroup.name}</strong> • Revelação: <strong>{activeGroup.drawDateFormatted || 'A definir'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onShareGroup && (
            <button
              onClick={() => onShareGroup(activeGroup)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#008069] hover:bg-[#02906f] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Convidar no WhatsApp</span>
            </button>
          )}

          <button
            onClick={handleCopyInviteLink}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' 
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Link copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FORMULÁRIO REAL DE ADICIONAR PARTICIPANTE DIRETAMENTE */}
      {isAdmin && (
        <div className={`p-5 rounded-3xl border space-y-3 ${
          isDark ? 'bg-slate-900/70 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Adicionar Participante Diretamente ao Grupo</h3>
              <p className="text-[11px] text-slate-500">
                Como organizador, pode adicionar amigos manualmente mesmo que não tenham o link.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
            <div className="sm:col-span-5">
              <input
                type="text"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Nome do amigo (ex: Ana Maria)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>

            <div className="sm:col-span-5">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Email (opcional)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          </form>

          {addFeedback && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center animate-fade-in">
              {addFeedback}
            </div>
          )}
        </div>
      )}

      {/* Action Shortcut Bar: Ir para Sorteio ou Ir para Chat */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setActiveTab('draw')}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Gift className="w-4 h-4 text-amber-200" />
          <span>{isDrawn ? 'Ver Sorteio Oficial Realizado' : `Aceder ao Sorteio (${membersCount} inscritos)`}</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#008069] hover:bg-[#02906f] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Abrir Chat do Grupo</span>
        </button>
      </div>

      {/* Lista Real de Membros */}
      <div className="space-y-3">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Membros Registados ({membersCount})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map((member) => {
            const isMemberAdmin = member.id === activeGroup.adminId;
            const isSelf = member.id === currentUser.id;

            return (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-300 hover:border-slate-400 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {member.name} {isSelf && '(Você)'}
                      </h4>
                      {isMemberAdmin && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 text-amber-700" />
                          <span>Organizador</span>
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onNavigateToWishlist}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Ver desejos"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {isAdmin && !isMemberAdmin && onRemoveMember && (
                    <button
                      onClick={() => {
                        if (confirm(`Remover "${member.name}" do grupo?`)) {
                          onRemoveMember(activeGroup.id, member.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Remover participante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
