import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Copy, 
  Check, 
  Share2, 
  X, 
  Lock, 
  KeyRound, 
  Briefcase, 
  Cake, 
  PartyPopper, 
  TreePine,
  Sparkles,
  FileText
} from 'lucide-react';
import { Group, GroupOccasion, ThemeMode } from '../types';

/* ========================================================================= */
/* 1. MODAL DE CRIAR NOVO GRUPO (Profissional, Multi-ocasião, com Regras)   */
/* ========================================================================= */
interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (newGroup: Omit<Group, 'id' | 'members' | 'participantsCount'>) => void;
  theme?: ThemeMode;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState<GroupOccasion>('geral');
  const [description, setDescription] = useState('');
  const [drawDate, setDrawDate] = useState('2026-12-15');
  const [currency, setCurrency] = useState('MZN');
  const [budget, setBudget] = useState('3000');
  const [maxParticipants, setMaxParticipants] = useState('12');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Gerar código limpo e moderno (sem forçar NATAL)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = occasion === 'empresa' ? 'CORP' : occasion === 'aniversario' ? 'NIV' : occasion === 'fim_ano' ? 'ANO' : 'BIL';
    const randomCode = `${prefix}-${randomSuffix}`;
    const dateFormatted = new Date(drawDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

    onCreateGroup({
      name,
      occasion,
      description: description || 'Detalhes e orientações do evento.',
      maxParticipants: parseInt(maxParticipants) || 12,
      drawDate,
      drawDateFormatted: dateFormatted,
      status: 'pending',
      currency,
      suggestedBudget: parseFloat(budget) || 3000,
      code: randomCode,
      adminId: `admin-${Date.now()}`
    });

    onClose();
  };

  const occasionsList: { id: GroupOccasion; label: string; icon: any }[] = [
    { id: 'geral', label: 'Amigos & Família', icon: Users },
    { id: 'empresa', label: 'Empresa & Trabalho', icon: Briefcase },
    { id: 'aniversario', label: 'Aniversário', icon: Cake },
    { id: 'fim_ano', label: 'Fim de Ano & Réveillon', icon: PartyPopper },
    { id: 'natal', label: 'Natal & Festas', icon: TreePine },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xl my-auto rounded-3xl border p-5 sm:p-8 shadow-2xl space-y-5 text-left max-h-[92vh] overflow-y-auto ${
          isDark 
            ? 'bg-[#0a1813] border-emerald-800 text-white' 
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDark ? 'border-emerald-900' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-black font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Criar Novo Grupo
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Configure os detalhes, as regras e o orçamento do seu evento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nome do Grupo */}
          <div>
            <label className={`block font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Nome do Grupo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Confraternização anual da equipa"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
              }`}
            />
          </div>

          {/* Ocasião do Sorteio (Livre e sem Natal forçado) */}
          <div>
            <label className={`block font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Ocasião do Sorteio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {occasionsList.map((occ) => {
                const Icon = occ.icon;
                const isSelected = occasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                        : isDark
                          ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{occ.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regras e Mensagem do Grupo */}
          <div>
            <label className={`block font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Regras e Orientações do Grupo
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Indique as regras, o local e as orientações para os participantes."
              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
              }`}
            />
          </div>

          {/* Data e Orçamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Data da Revelação
              </label>
              <input
                type="date"
                required
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
                }`}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Orçamento Sugerido (MZN)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ex: 3000"
                className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
                }`}
              />
            </div>
          </div>

          {/* Submeter */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Criar grupo e gerar convite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. MODAL DE ENTRAR NO GRUPO COM CÓDIGO                                   */
/* ========================================================================= */
interface JoinGroupModalProps {
  isOpen: boolean;
  prefilledCode?: string;
  onClose: () => void;
  onJoinSuccess: (code: string, name: string, email: string) => void;
  theme?: ThemeMode;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  prefilledCode = '',
  onClose,
  onJoinSuccess,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [code, setCode] = useState(prefilledCode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  React.useEffect(() => {
    if (prefilledCode) {
      setCode(prefilledCode);
    }
  }, [prefilledCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    setIsJoining(true);
    await onJoinSuccess(code.trim().toUpperCase(), name.trim(), email.trim());
    setIsJoining(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md my-auto rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-4 text-left ${
          isDark 
            ? 'bg-[#0a1813] border-emerald-800 text-white' 
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-emerald-900' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Entrar num Grupo
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Insira o código enviado pelo organizador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className={`block font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Código do Convite <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: BIL-4921"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-bold tracking-wider uppercase focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-emerald-300 focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-emerald-800 focus:border-emerald-600'
              }`}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              O seu Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser identificado(a)?"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
              }`}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              O seu Email (opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#008069] hover:bg-[#02906f] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Entrar no Grupo
          </button>
        </form>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. MODAL DE PARTILHAR (Ultra Limpo, Profissional, Sem Balão Gigante)      */
/* ========================================================================= */
export const ShareGroupModal: React.FC<{
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
  theme?: ThemeMode;
}> = ({ isOpen, group, onClose, theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !group) return null;

  const joinLink = typeof window !== 'undefined' 
    ? `${window.location.origin}?join=${group.code}` 
    : `https://bilar-amigo-secreto.app?join=${group.code}`;

  const whatsappMessage = `🎁 *Convite: Amigo Secreto Bilar* 🎁

Olá! Você foi convidado(a) para o nosso Amigo Secreto no grupo:
✨ *"${group.name}"* ✨

🗓️ *Data da Revelação:* ${group.drawDateFormatted || '15 Dezembro'}
💰 *Orçamento:* ${group.suggestedBudget ? `${group.suggestedBudget} MZN` : 'A combinar'}
🔑 *Código de Entrada:* *${group.code}*

👉 *Para entrar direto no grupo com 1 toque:*
${joinLink}

_Bilar Amigo Secreto • Bilar DigitalTech Solutions_ 🎉`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(group.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md my-auto rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-4 text-center ${
          isDark 
            ? 'bg-[#0a1813] border-emerald-800 text-white' 
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDark ? 'border-emerald-900' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold truncate max-w-[220px] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Partilhar Convite
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {group.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card 1: Código de Entrada em Destaque */}
        <div className={`p-4 rounded-2xl border text-center space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-300 shadow-xs'
        }`}>
          <span className={`text-xs font-semibold uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Código de Acesso
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-2xl sm:text-3xl font-mono font-black tracking-widest ${
              isDark ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              {group.code}
            </span>
            <button
              onClick={handleCopyCode}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                copiedCode 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : isDark ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 shadow-xs'
              }`}
              title="Copiar Código"
            >
              {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 2: Link Direto */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 text-left ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-300 shadow-xs'
        }`}>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className={`text-[11px] font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Link de Entrada Direto
            </span>
            <p className={`text-xs font-mono truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {joinLink}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
              copiedLink 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : isDark ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100 border-slate-300 shadow-xs'
            }`}
          >
            {copiedLink ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Botão Principal: Enviar no WhatsApp (Abre o WhatsApp com mensagem formatada) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          <span className="text-lg">💬</span>
          <span>Partilhar no WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
