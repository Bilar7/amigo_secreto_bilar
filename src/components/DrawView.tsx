import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gift, 
  Sparkles, 
  MessageCircle, 
  Heart, 
  Lock, 
  RotateCcw, 
  Volume2, 
  Clock, 
  Users, 
  EyeOff, 
  ShieldCheck, 
  PartyPopper,
  Plus,
  KeyRound,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { User, ThemeMode, ActiveTab, Group } from '../types';
import { sounds } from '../utils/soundEffects';

interface DrawViewProps {
  secretSantaMatch: User | null;
  theme?: ThemeMode;
  activeGroup?: Group | null;
  groups?: Group[];
  currentUser?: User | null;
  onNavigateToChat: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onTriggerDraw?: (groupId: string) => void;
  onSelectGroup?: (group: Group) => void;
}

export const DrawView: React.FC<DrawViewProps> = ({
  secretSantaMatch,
  theme = 'light',
  activeGroup,
  groups,
  currentUser,
  onNavigateToChat,
  setActiveTab,
  onTriggerDraw,
  onSelectGroup
}) => {
  const isDark = theme === 'dark';
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);

  // 1. Se NÃO HOUVER NENHUM GRUPO CRIADO OU REGISTADO
  if (!activeGroup || !groups || groups.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4 px-2 sm:px-4 pb-8">
        <div className="relative rounded-3xl border border-emerald-800/60 p-6 sm:p-10 shadow-2xl text-center space-y-5 overflow-hidden bg-gradient-to-br from-[#071710] via-[#0b271d] to-[#1c080e] text-white">
          {/* Fundo de presentes com bokeh quente */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 scale-105 pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
          />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-lg">
              <Gift className="w-8 h-8 text-amber-300 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                Nenhum Grupo Registado
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Para realizar o sorteio, precisa de um grupo!
              </h2>
              <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed text-emerald-100/80">
                Crie o seu primeiro grupo e convide amigos pelo WhatsApp, ou entre num grupo existente com um código de convite.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('groups')}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Novo Grupo</span>
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className="flex-1 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Entrar com Código</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDrawn = activeGroup.status === 'drawn';
  const members = activeGroup.members || [];
  const membersCount = members.length;
  const isAdmin = currentUser ? activeGroup.adminId === currentUser.id : false;
  const hasEnoughMembers = membersCount >= 2;

  const triggerCelebration = () => {
    sounds.playCelebrationSound();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#dc2626', '#10b981', '#f59e0b', '#ec4899', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#f59e0b', '#10b981', '#3b82f6']
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#dc2626', '#ec4899', '#f59e0b']
      });
    }, 400);
  };

  const handleStartDraw = () => {
    setIsRevealed(false);
    setIsTemporarilyHidden(false);
    setIsShaking(true);
    setCountdown(3);

    sounds.playSuspenseSound(2.3);

    setTimeout(() => setCountdown(2), 700);
    setTimeout(() => setCountdown(1), 1400);

    setTimeout(() => {
      setIsShaking(false);
      setCountdown(null);
      setIsRevealed(true);
      triggerCelebration();
    }, 2200);
  };

  const handlePerformDrawNow = () => {
    if (activeGroup && onTriggerDraw) {
      onTriggerDraw(activeGroup.id);
      setTimeout(() => {
        handleStartDraw();
      }, 300);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-2 sm:px-4 pb-10">
      {/* 1. SELETOR DE GRUPOS REGISTADOS (SE HOUVER MAIS DE UM) */}
      {groups && groups.length > 1 && (
        <div className={`p-3 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>Seus Grupos Registados:</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Toque para alternar
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {groups.map((g) => {
              const isSelected = activeGroup.id === g.id;
              const isGroupDrawn = g.status === 'drawn';
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    if (onSelectGroup) {
                      onSelectGroup(g);
                      setIsRevealed(false);
                      setIsTemporarilyHidden(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{g.name}</span>
                  {isGroupDrawn && (
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-emerald-900 text-emerald-200 font-mono">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO ARENA DE REVELAÇÃO E PRESENTES COM FUNDO FESTIVO MÁGICO           */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-700/60 bg-gradient-to-br from-[#06150f] via-[#091a13] to-[#1c0810] text-white p-5 sm:p-8">
        {/* Fundo de presentes reais e iluminação aconchegante */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=85')` }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Festive 3D Present Boxes */}

        {/* Floating Celebration Particles */}
        
        

        {/* CONTEÚDO PRINCIPAL DO PALCO */}
        <div className="relative z-20 space-y-5 text-center">
          
          {/* SE O GRUPO AINDA NÃO FOI SORTEADO */}
          {!isDrawn ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  Sorteio Pendente
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {activeGroup.name}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto leading-relaxed">
                  O sorteio deste grupo está aguardando ativação oficial do organizador.
                </p>
              </div>

              {/* Box de Contagem de Membros */}
              <div className="p-3.5 rounded-2xl bg-[#0c2b20]/95 border border-emerald-500/45 backdrop-blur-sm flex items-center justify-between text-xs font-semibold max-w-md mx-auto">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Participantes Inscritos:</span>
                </div>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {membersCount} participante(s)
                </span>
              </div>

              {/* Privacidade: não revelar a lista de nomes no ecrã do sorteio. */}

              {/* Painel do Organizador vs Membro */}
              {isAdmin ? (
                hasEnoughMembers ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 space-y-3 max-w-md mx-auto shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Você é o Organizador! O grupo já tem membros suficientes.</span>
                    </div>
                    <button
                      onClick={handlePerformDrawNow}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Realizar Sorteio Agora 🎉</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/50 text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold">
                      <Lock className="w-4 h-4" />
                      <span>Falta pelo menos {Math.max(1, 2 - membersCount)} participante para poder sortear</span>
                    </div>
                    <p className="text-[11px] text-amber-200/80">
                      Adicione participantes no ecrã de Participantes ou partilhe o código no WhatsApp.
                    </p>
                    <button
                      onClick={() => setActiveTab('participants')}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      + Adicionar Participante ao Grupo
                    </button>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-[#102d23]/95 border border-emerald-800 text-xs max-w-md mx-auto">
                  <p className="flex items-center justify-center gap-1.5 font-medium text-emerald-200">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Aguardando o organizador realizar o sorteio oficial.</span>
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <button
                  onClick={() => setActiveTab('groups')}
                  className="flex-1 py-3 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Ver Detalhes do Grupo
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            /* SE O GRUPO JÁ FOI SORTEADO — Palco Mágico de Revelação */
            <div className="space-y-5">
              {!isRevealed || isTemporarilyHidden ? (
                /* CAIXA MISTERIOSA 3D COM SUSPENSE E ILUMINAÇÃO */
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Sorteio Realizado ✓
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                      Descubra Quem Você Tirou!
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto leading-relaxed">
                      Toque na caixa de presente abaixo para iniciar o suspense sonoro e a revelação do grupo <strong>{activeGroup.name}</strong>!
                    </p>
                  </div>

                  {/* Pedestal de Iluminação com Caixa 3D */}
                  <div className="relative py-4">
                    {/* Glowing golden circle pedestal */}
                    <div className="absolute inset-0 max-w-[200px] h-[200px] mx-auto rounded-full bg-gradient-to-tr from-amber-500/30 via-emerald-500/20 to-red-500/30 blur-2xl pointer-events-none" />

                    <div 
                      onClick={handleStartDraw}
                      className={`relative z-10 mx-auto w-36 h-36 rounded-3xl p-4 border-2 shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 select-none ${
                        isShaking ? 'animate-gift-shake' : 'animate-gentle-float'
                      } bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 border-amber-300`}
                    >
                      {/* Ribbons */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 bg-red-600 border-x border-red-400 shadow-sm" />
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 bg-red-600 border-y border-red-400 shadow-sm" />
                      
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">
                        🎀
                      </div>

                      {countdown !== null ? (
                        <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950 text-amber-300 font-mono text-3xl font-black flex items-center justify-center border-2 border-amber-400 animate-pulse shadow-lg">
                          {countdown}
                        </div>
                      ) : (
                        <div className="relative z-10 text-center bg-slate-950/85 rounded-xl px-3 py-1.5 text-white border border-slate-800 shadow-md">
                          <span className="text-2xl block">🎁</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Toque aqui</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2 max-w-md mx-auto">
                    <button
                      onClick={handleStartDraw}
                      disabled={isShaking}
                      className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Volume2 className="w-4 h-4 text-amber-200" />
                      <span>{isShaking ? 'Sorteando...' : 'Revelar com Som & Suspense'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsRevealed(true);
                        setIsTemporarilyHidden(false);
                        triggerCelebration();
                      }}
                      disabled={isShaking}
                      className="py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Revelar Direto</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* CARTÃO DO AMIGO REVELADO NO PALCO COM ALTO CONTRASTE */
                <div className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-4 shadow-2xl relative animate-fade-in max-w-lg mx-auto ${
                  isDark ? 'bg-[#0a1813]/95 border-emerald-500 text-white' : 'bg-white border-emerald-500 text-slate-900 shadow-2xl'
                }`}>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                    <PartyPopper className="w-4 h-4 text-emerald-700" />
                    <span>O SEU AMIGO SECRETO É:</span>
                  </div>

                  {secretSantaMatch ? (
                    <>
                      {/* Avatar do Amigo Revelado com Auréola Dourada */}
                      <div className="relative mx-auto w-28 h-28 my-2">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-500 to-red-500 blur-md opacity-80 animate-pulse" />
                        <img
                          src={secretSantaMatch.avatar}
                          alt={secretSantaMatch.name}
                          className="relative z-10 w-full h-full rounded-full object-cover ring-4 ring-emerald-500 shadow-2xl"
                        />
                        <span className="absolute bottom-0 right-0 z-20 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm shadow-md border-2 border-white">
                          🎁
                        </span>
                      </div>

                      {/* Nome e Grupo */}
                      <div className="space-y-1">
                        <h3 className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {secretSantaMatch.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          Grupo: {activeGroup.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Orçamento sugerido: <strong>{activeGroup.suggestedBudget || 3000} {activeGroup.currency || 'MZN'}</strong>
                        </p>
                      </div>

                      {/* Ações Diretas */}
                      <div className="space-y-2.5 pt-2">
                        <button
                          onClick={() => setActiveTab('wishlist')}
                          className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Ver Lista de Desejos de {secretSantaMatch.name.split(' ')[0]}</span>
                        </button>

                        <button
                          onClick={onNavigateToChat}
                          className="w-full py-3.5 rounded-2xl bg-[#008069] hover:bg-[#02906f] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Conversar no Chat Anônimo</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        O sorteio foi efetuado, mas o seu utilizador ainda não tem um amigo atribuído.
                      </p>
                      <p className="text-xs text-slate-500">
                        Verifique se o seu utilizador faz parte da lista de participantes deste grupo.
                      </p>
                    </div>
                  )}

                  {/* Opção para Organizador Refazer Sorteio */}
                  {isAdmin && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => {
                          if (confirm(`Deseja refazer o sorteio do grupo "${activeGroup.name}"? Será gerado um novo ciclo de amigos secretos para todos os ${membersCount} membros inscritos.`)) {
                            onTriggerDraw?.(activeGroup.id);
                          }
                        }}
                        className={`text-xs underline font-bold transition-colors cursor-pointer ${
                          isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
                        }`}
                      >
                        Refazer Sorteio deste Grupo (se novos amigos entraram)
                      </button>
                    </div>
                  )}

                  {/* Mini botões ocultar e repetir */}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
                    <button
                      onClick={() => setIsTemporarilyHidden(true)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      title="Ocultar para ninguém espreitar"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Ocultar Tela</span>
                    </button>

                    <button
                      onClick={handleStartDraw}
                      className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:underline transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Repetir Revelação</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
