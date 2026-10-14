import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip,
  FileText,
  Smile, 
  Mic, 
  Lock, 
  Users, 
  ArrowLeft,
  Play,
  Pause,
  Trash2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { ChatMessage, User, Group, ThemeMode } from '../types';
import { sounds } from '../utils/soundEffects';

interface ChatViewProps {
  currentUser: User;
  secretSantaMatch: User | null;
  messages: ChatMessage[];
  theme?: ThemeMode;
  onSendMessage: (content: string, isAnonymous: boolean, recipientId?: string, audioUrl?: string, audioDuration?: string, attachmentUrl?: string, attachmentName?: string, attachmentType?: string) => void;
  activeGroup?: Group | null;
  onMarkAsRead?: (msgId: string) => void;
  onMarkAllAsRead?: () => void;
  onNavigateToDashboard?: () => void;
}

/**
 * Leitor interativo de Notas de Voz estilo WhatsApp
 */
const AudioPlayerBubble: React.FC<{
  audioUrl: string;
  duration?: string;
  isMe: boolean;
  isDark: boolean;
}> = ({ audioUrl, duration, isMe, isDark }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.warn('Erro ao reproduzir áudio:', e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-3 py-1 pr-6 min-w-[200px] sm:min-w-[240px]">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer"
        title={isPlaying ? "Pausar áudio" : "Ouvir áudio"}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
      </button>

      <div className="flex-1 space-y-1">
        {/* Waveform graphic bars */}
        <div className="flex items-center gap-0.5 h-6">
          {[40, 70, 30, 90, 60, 100, 50, 80, 40, 90, 70, 30, 60, 85, 45, 75, 35, 65].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all ${
                isPlaying ? 'bg-[#00a884] animate-pulse' : isDark ? 'bg-slate-500' : 'bg-slate-400'
              }`}
              style={{ height: `${isPlaying ? Math.max(25, (h * (i % 2 === 0 ? 1 : 0.75))) : h}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>{isPlaying ? formatTime(currentTime) : (duration || '0:05')}</span>
          <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
            <Volume2 className="w-3 h-3" /> Áudio
          </span>
        </div>
      </div>
    </div>
  );
};

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  secretSantaMatch,
  messages,
  theme = 'light',
  onSendMessage,
  activeGroup,
  onMarkAsRead,
  onNavigateToDashboard
}) => {
  const isDark = theme === 'dark';
  const [selectedChannel, setSelectedChannel] = useState<string>('group');
  const [showMobileChat, setShowMobileChat] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'conversas' | 'secretos' | 'grupos'>('conversas');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [showMicConsent, setShowMicConsent] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeGroup) {
    return (
      <div className={`w-full max-w-lg mx-auto p-8 rounded-3xl border text-center space-y-4 shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold">Nenhum grupo ativo</h3>
        <p className="text-xs text-slate-500">
          Crie um grupo ou entre num grupo existente para poder conversar e trocar mensagens no chat.
        </p>
        <button 
          onClick={onNavigateToDashboard} 
          className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all cursor-pointer"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  // Canais Dinâmicos 100% Reais
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

  const groupChannel = {
    id: 'group',
    name: `Grupo: ${activeGroup.name}`,
    preview: lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : 'Inicie a conversa no grupo...',
    time: lastMsg ? lastMsg.timestamp : 'Hoje',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=120&auto=format&fit=crop&q=80',
    isGroup: true,
    unreadCount: 0,
    status: `${activeGroup.members ? activeGroup.members.length : activeGroup.participantsCount} participantes`,
    type: 'grupo' as const
  };

  const secretChannel = secretSantaMatch ? [{
    id: 'target',
    name: `${secretSantaMatch.name} (Meu Amigo Secreto 🎭)`,
    preview: 'Envie pistas anônimas sobre o presente! 🎁',
    time: 'Hoje',
    avatar: secretSantaMatch.avatar,
    isSecretTarget: true,
    unreadCount: 0,
    status: 'online',
    type: 'secreto' as const
  }] : [];

  const memberChannels = (activeGroup.members || [])
    .filter(m => m.id !== currentUser.id && m.id !== secretSantaMatch?.id)
    .map(m => ({
      id: m.id,
      name: m.name,
      preview: 'Conversar com ' + m.name.split(' ')[0],
      time: 'Hoje',
      avatar: m.avatar,
      unreadCount: 0,
      status: m.isReady ? 'online' : 'participante',
      type: 'individual' as const
    }));

  const channels = [groupChannel, ...secretChannel, ...memberChannels];

  const quickEmojis = ['🎁', '✨', '❤️', '😂', '👍', '🔥', '👏', '🎉', '🍫', '☕', '🎂', '🥳'];

  // Iniciar Gravação de Áudio Real
  const handleStartRecording = async () => {
    setShowMicConsent(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('O seu navegador não suporta gravação de áudio direto.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const mins = Math.floor(recordingSeconds / 60);
          const secs = recordingSeconds % 60;
          const durFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
          
          const recipient = selectedChannel === 'group' ? undefined : (selectedChannel === 'target' ? secretSantaMatch?.id : selectedChannel);
          sounds.playMessageSentSound();
          onSendMessage("🎙️ Mensagem de voz", isAnonymousMode, recipient, base64Audio, durFormatted || '0:05');
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microfone não autorizado:', err);
      alert('Para gravar mensagens de voz, autorize o acesso ao microfone nas definições do navegador.');
    }
  };

  const handleStopAndSendRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingSeconds(0);
      audioChunksRef.current = [];
    }
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    // Limite compatível com o tamanho máximo de um documento Firestore; ficheiros grandes devem usar Firebase Storage.
    if (file.size > 350 * 1024) {
      alert('Este anexo é demasiado grande para o envio atual. Escolha um ficheiro até 350 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const recipient = selectedChannel === 'group' ? undefined : (selectedChannel === 'target' ? secretSantaMatch?.id : selectedChannel);
      onSendMessage(`📎 ${file.name}`, isAnonymousMode, recipient, undefined, undefined, String(reader.result || ''), file.name, file.type || 'application/octet-stream');
      sounds.playMessageSentSound();
    };
    reader.onerror = () => alert('Não foi possível ler este ficheiro. Tente novamente.');
    reader.readAsDataURL(file);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sounds.playMessageSentSound();
    const recipient = selectedChannel === 'group' ? undefined : (selectedChannel === 'target' ? secretSantaMatch?.id : selectedChannel);
    onSendMessage(inputMessage, isAnonymousMode, recipient);
    setInputMessage('');
    setShowEmojiPicker(false);
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [msgId]: prev[msgId] === emoji ? '' : emoji
    }));
  };

  const currentMessages = messages.filter(m => {
    if (selectedChannel === 'group') return !m.recipientId;
    if (selectedChannel === 'target') return m.recipientId === secretSantaMatch?.id || m.senderId === secretSantaMatch?.id;
    return m.recipientId === selectedChannel || m.senderId === selectedChannel;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  const activeChannelObj = channels.find(c => c.id === selectedChannel) || channels[0];

  const filteredChannels = channels.filter(c => {
    if (activeTabFilter === 'secretos') return c.type === 'secreto';
    if (activeTabFilter === 'grupos') return c.type === 'grupo';
    return true;
  });

  const requestVoiceRecording = () => setShowMicConsent(true);

  return (
    <div className={`w-full h-full flex flex-col md:flex-row overflow-hidden border rounded-3xl shadow-2xl ${
      isDark 
        ? 'bg-[#111b21] border-[#222d34] text-[#e9edef]' 
        : 'bg-white border-slate-300 text-[#111b21]'
    }`}>
      {showMicConsent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-labelledby="voice-consent-title">
          <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${isDark ? 'bg-[#17252b] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Mic className="h-5 w-5" /></div>
            <h3 id="voice-consent-title" className="text-lg font-bold">Gravar mensagem de voz?</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>O Bilar Conversas precisa de acesso ao microfone para gravar. A gravação só começa depois de confirmares e podes cancelar antes de enviar.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowMicConsent(false)} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>Agora não</button>
              <button type="button" onClick={handleStartRecording} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Permitir e gravar</button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* PAINEL ESQUERDO: LISTA DE CONVERSAS                                       */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r shrink-0 ${
        showMobileChat ? 'hidden md:flex' : 'flex'
      } ${
        isDark ? 'border-[#222d34] bg-[#111b21]' : 'border-slate-200 bg-white'
      }`}>
        {/* Header do WhatsApp */}
        <div className={`p-3.5 flex items-center justify-between border-b ${
          isDark ? 'bg-[#202c33] border-[#222d34]' : 'bg-[#f0f2f5] border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00a884]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] ring-2 ring-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Conversas</h2>
              <span className="text-[11px] text-emerald-600 font-semibold">{currentUser.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
            <button 
              onClick={() => setIsAnonymousMode(!isAnonymousMode)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isAnonymousMode ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title={isAnonymousMode ? "Modo Anônimo Ativo" : "Ativar Modo Anônimo"}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs de Filtro */}
        <div className={`flex items-center justify-around border-b text-xs font-bold ${
          isDark ? 'bg-[#111b21] border-[#222d34]' : 'bg-white border-slate-200'
        }`}>
          {(['conversas', 'grupos', 'secretos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              className={`flex-1 py-3 text-center border-b-2 capitalize transition-colors cursor-pointer ${
                activeTabFilter === tab
                  ? 'border-[#00a884] text-[#00a884]'
                  : isDark ? 'border-transparent text-[#8696a0] hover:text-white' : 'border-transparent text-[#54656f] hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista de Canais */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#222d34]">
          {filteredChannels.map((channel) => {
            const isSelected = selectedChannel === channel.id;

            return (
              <div
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel.id);
                  setShowMobileChat(true);
                  if (onMarkAsRead) onMarkAsRead(channel.id);
                }}
                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? isDark ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]'
                    : isDark ? 'hover:bg-[#202c33]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {channel.type === 'secreto' && (
                    <span className="absolute -bottom-1 -right-1 text-sm">🎭</span>
                  )}
                  {channel.type === 'grupo' && (
                    <span className="absolute -bottom-1 -right-1 text-sm">👥</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm truncate">{channel.name}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{channel.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate mt-0.5 font-normal">
                    {channel.preview}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAINEL DIREITO: ÁREA DO CHAT WHATSAPP COM GRAVAÇÃO DE ÁUDIO REAL          */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden ${
        !showMobileChat ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Top Chat Bar Header */}
        <div className={`p-2.5 sm:p-3 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'bg-[#202c33] border-[#222d34]' : 'bg-[#f0f2f5] border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Botão Voltar no Mobile */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="md:hidden p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              title="Voltar às conversas"
            >
              <ArrowLeft className="w-5 h-5 text-[#54656f] dark:text-[#aebac1]" />
            </button>

            <div className="relative shrink-0">
              <img
                src={activeChannelObj.avatar}
                alt={activeChannelObj.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeChannelObj.type === 'secreto' && (
                <span className="absolute -bottom-1 -right-1 text-xs">🎭</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">{activeChannelObj.name}</h3>
              <span className="text-[11px] text-[#00a884] font-semibold block leading-tight">
                {activeChannelObj.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#54656f] dark:text-[#aebac1]">
            <button 
              onClick={() => setIsAnonymousMode(!isAnonymousMode)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                isAnonymousMode
                  ? 'bg-amber-500 text-white border-amber-600'
                  : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Alternar modo anônimo"
            >
              <span>🎭 Anônimo: {isAnonymousMode ? 'LIGADO' : 'DESLIGADO'}</span>
            </button>

            <button 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed Canvas — Cores Autênticas do Fundo de Conversa do WhatsApp */}
        <div className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 select-text ${
          isDark ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
        }`}>
          {/* Banner de Criptografia e Sigilo */}
          <div className="flex justify-center my-2">
            <span className={`text-[10px] px-3 py-1 rounded-lg border shadow-2xs font-semibold flex items-center gap-1 ${
              isDark ? 'bg-[#182229] border-[#222d34] text-[#ffd279]' : 'bg-[#ffeecd] border-[#fed7aa] text-[#7c2d12]'
            }`}>
              <Lock className="w-3 h-3" />
              <span>Sorteio Seguro: As mensagens anônimas não revelam a identidade real.</span>
            </span>
          </div>

          {currentMessages.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl">🎁</span>
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Nenhuma mensagem nesta conversa ainda
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Envie uma mensagem de texto ou grave um áudio de voz para começar!
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
                >
                  {!isMe && (
                    <span className={`text-[11px] font-bold mb-0.5 ml-2 ${
                      isDark ? 'text-[#00a884]' : 'text-[#008069]'
                    }`}>
                      {msg.senderName}
                    </span>
                  )}

                  {/* Bubble Container: Balões Oficiais do WhatsApp com Alto Contraste */}
                  <div
                    className={`relative max-w-[85%] sm:max-w-md px-3.5 py-2 rounded-2xl text-xs sm:text-sm shadow-md break-words ${
                      isMe
                        ? isDark
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-xs' // Modo Escuro Enviado
                          : 'bg-[#d9fdd3] text-[#111b21] rounded-tr-xs shadow-xs border border-emerald-200/60' // Modo Claro Enviado
                        : isDark
                          ? 'bg-[#202c33] text-[#e9edef] rounded-tl-xs' // Modo Escuro Recebido
                          : 'bg-[#ffffff] text-[#111b21] rounded-tl-xs shadow-xs border border-slate-200' // Modo Claro Recebido
                    }`}
                  >
                    {/* Badge Anônimo */}
                    {msg.isAnonymous && (
                      <div className="text-[10px] font-bold text-amber-500 mb-1 flex items-center gap-1">
                        <span>🎭 Mensagem Secreta Anônima</span>
                      </div>
                    )}

                    {/* Conteúdo: ÁUDIO REAL ou Texto */}
                    {msg.attachmentUrl ? (
                      <div className="min-w-[180px] max-w-full space-y-2">
                        {msg.attachmentType?.startsWith('image/') ? (
                          <a href={msg.attachmentUrl} download={msg.attachmentName || 'anexo'} className="block">
                            <img src={msg.attachmentUrl} alt={msg.attachmentName || 'Imagem anexada'} className="max-h-56 w-auto rounded-xl object-contain" />
                          </a>
                        ) : null}
                        <a href={msg.attachmentUrl} download={msg.attachmentName || 'anexo'} className="flex items-center gap-2 rounded-xl border border-emerald-700/20 bg-black/5 p-3 hover:bg-black/10">
                          <FileText className="h-5 w-5 shrink-0 text-emerald-700" />
                          <span className="min-w-0 flex-1 break-all text-xs font-semibold">{msg.attachmentName || 'Ficheiro anexado'}<span className="block text-[10px] font-normal opacity-70">Transferir ficheiro</span></span>
                        </a>
                      </div>
                    ) : msg.audioUrl ? (
                      <AudioPlayerBubble
                        audioUrl={msg.audioUrl}
                        duration={msg.audioDuration}
                        isMe={isMe}
                        isDark={isDark}
                      />
                    ) : (
                      <p className="leading-relaxed pr-12 text-sm select-text font-normal">
                        {msg.content}
                      </p>
                    )}

                    {/* Timestamp & Double Check */}
                    <div className="flex items-center justify-end gap-1 float-right mt-1 ml-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck className={`w-3.5 h-3.5 ${
                          msg.status === 'read' ? 'text-[#53bdeb]' : 'text-slate-400'
                        }`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Bar se Aberto */}
        {showEmojiPicker && (
          <div className={`p-2 border-t flex items-center gap-2 overflow-x-auto ${
            isDark ? 'bg-[#202c33] border-[#222d34]' : 'bg-white border-slate-200'
          }`}>
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setInputMessage(prev => prev + emoji)}
                className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Message Input Footer com Gravação de Áudio Real */}
        <form 
          onSubmit={handleSend}
          className={`p-2 sm:p-2.5 border-t flex items-center gap-2 shrink-0 z-30 ${
            isDark 
              ? 'bg-[#202c33] border-[#222d34]' 
              : 'bg-[#f0f2f5] border-slate-300'
          }`}
        >
          {isRecording ? (
            /* Barra de Gravação de Voz Ativa */
            <div className="flex-1 flex items-center justify-between bg-red-950/20 border border-red-500/50 rounded-3xl px-4 py-2 text-red-600 dark:text-red-400 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                <span className="text-xs font-bold font-mono">
                  Gravando voz: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60) < 10 ? '0' : ''}{recordingSeconds % 60}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="p-1.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500 cursor-pointer"
                  title="Cancelar gravação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleStopAndSendRecording}
                  className="px-3.5 py-1.5 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Enviar áudio gravado"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Áudio</span>
                </button>
              </div>
            </div>
          ) : (
            /* Campo de Texto Normal com Botão de Microfone */
            <>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleAttachment} accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-2 rounded-full transition-colors cursor-pointer ${isDark ? 'text-[#8696a0] hover:text-white' : 'text-[#54656f] hover:text-[#111b21]'}`} title="Anexar ficheiro (até 350 KB)">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Emoji Toggle */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-[#8696a0] hover:text-white' : 'text-[#54656f] hover:text-[#111b21]'
                }`}
                title="Emojis"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Botão de Gravar Áudio Real */}
              <button
                type="button"
                onClick={requestVoiceRecording}
                className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Gravar nota de voz real"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Text Input Box */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isAnonymousMode ? "Escrever mensagem secreta..." : "Escreva uma mensagem..."}
                  className={`w-full py-2.5 px-4 rounded-3xl text-sm border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-[#2a3942] border-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:border-[#00a884]' 
                      : 'bg-white border-slate-300 text-[#111b21] placeholder-[#667781] focus:border-[#008069] shadow-xs'
                  }`}
                />
              </div>

              {/* Send Button: WhatsApp Teal Circle */}
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
                title="Enviar mensagem"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
