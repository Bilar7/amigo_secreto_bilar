/**
 * Bilar Amigo Secreto — Aplicação Oficial
 * Desenvolvido por Bilar DigitalTech Solutions
 * Aplicação Bilar Amigo Secreto com chat, áudio e integração Firebase (jfb-amigo-secreto-pro-2026)
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeLandingView } from './components/WelcomeLandingView';
import { AuthCardView } from './components/AuthCardView';
import { DashboardView } from './components/DashboardView';
import { GroupsView } from './components/GroupsView';
import { ParticipantsView } from './components/ParticipantsView';
import { DrawView } from './components/DrawView';
import { ChatView } from './components/ChatView';
import { WishlistView } from './components/WishlistView';
import { SettingsView } from './components/SettingsView';
import { NotificationsView } from './components/NotificationsView';
import { AuthModal } from './components/AuthModal';
import { CreateGroupModal, JoinGroupModal, ShareGroupModal } from './components/GroupModals';
import { BrandLogo, PwaInstallPrompt } from './components/FestiveIcons';
import { firestoreService } from './services/firebase';
import { firebaseAuthService } from './services/firebaseAuth';

import { ActiveTab, Group, WishlistItem, ChatMessage, User, AppNotification, ThemeMode, GroupMember } from './types';
import { sounds } from './utils/soundEffects';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Heart, 
  Gift
} from 'lucide-react';

export default function App() {
  // Utilizador real (persistido em localStorage / Firebase)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bilar_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Se o utilizador já tem sessão iniciada, abre no Dashboard; caso contrário, na Landing Page
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const savedUser = localStorage.getItem('bilar_user');
      return savedUser ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  });
  
  // Grupos 100% reais carregados do localStorage ou Firebase (inicializa vazio se for novo utilizador)
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem('bilar_groups');
      return saved ? (JSON.parse(saved) as Group[]).filter((g) => !!currentUser && (g.adminId === currentUser.id || (g.members || []).some((m) => m.id === currentUser.id))) : [];
    } catch {
      return [];
    }
  });

  const [activeGroupId, setActiveGroupId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bilar_groups');
      const parsed = saved ? JSON.parse(saved) as Group[] : [];
      const visible = parsed.filter((g) => !!currentUser && (g.adminId === currentUser.id || (g.members || []).some((m) => m.id === currentUser.id)));
      return visible[0]?.id || '';
    } catch {
      return '';
    }
  });

  // Lista de desejos real
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('bilar_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mensagens reais de chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bilar_chat');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notificações reais
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('bilar_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme mode: light or dark
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('bilar_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const handleToggleTheme = () => {
    setTheme((prev: ThemeMode) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('bilar_theme', next);
      } catch {}
      return next;
    });
  };

  // Modais de ações
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
  const [joinCodePrefill, setJoinCodePrefill] = useState('');
  const [sharingGroup, setSharingGroup] = useState<Group | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Sincronização automática para LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bilar_groups', JSON.stringify(groups));
    } catch (e) {}
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem('bilar_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bilar_chat', JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('bilar_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('bilar_user', JSON.stringify(currentUser));
      } catch (e) {}
    } else {
      localStorage.removeItem('bilar_user');
    }
  }, [currentUser]);

  // Sincronização em segundo plano periódica e reativa com o Firebase Firestore
  useEffect(() => {
    const syncGroups = () => {
      firestoreService.getGroups().then((remote) => {
        if (remote && remote.length > 0 && currentUser) {
          // A interface só mantém grupos dos quais a sessão atual é membro ou organizador.
          const visible = remote.filter((g) => g.adminId === currentUser.id || (g.members || []).some((m) => m.id === currentUser.id));
          setGroups((prev) => {
            const locallyCreated = prev.filter((g) => g.adminId === currentUser.id || (g.members || []).some((m) => m.id === currentUser.id));
            const merged = [...visible];
            locallyCreated.forEach((g) => { if (!merged.some((item) => item.id === g.id)) merged.push(g); });
            return merged;
          });
          setActiveGroupId((prev) => prev && visible.some((g) => g.id === prev) ? prev : (visible[0]?.id || ''));
        }
      }).catch(() => {});
    };

    // Sincronização inicial
    syncGroups();

    // Sincroniza periodicamente a cada 5 segundos para refletir novos membros em tempo real
    const interval = setInterval(syncGroups, 5000);

    // Sincroniza imediatamente ao regressar ao navegador (ex: após partilhar no WhatsApp)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncGroups();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentUser?.id]);

  // Leitura de parâmetros de URL: ?join=CODIGO
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      setJoinCodePrefill(joinCode.toUpperCase());
      setIsJoinGroupOpen(true);
    }
  }, []);

  const visibleGroups = groups.filter((g) => !!currentUser && (g.adminId === currentUser.id || (g.members || []).some((m) => m.id === currentUser.id)));
  const activeGroup = visibleGroups.find(g => g.id === activeGroupId) || visibleGroups[0] || null;

  // Troca de grupo ativo e navegação entre ecrãs
  const handleSelectGroup = (group: Group, targetTab: ActiveTab = 'draw') => {
    setActiveGroupId(group.id);
    setActiveTab(targetTab);
  };

  // Resolução do Amigo Secreto Real (sem nomes fictícios)
  const currentSecretSantaMatch: User | null = React.useMemo(() => {
    if (!activeGroup || activeGroup.status !== 'drawn' || !currentUser) return null;
    const currentMember = activeGroup.members?.find(m => m.id === currentUser.id);
    if (currentMember?.assignedTo) {
      const matchedMember = activeGroup.members?.find(m => m.id === currentMember.assignedTo);
      if (matchedMember) {
        return {
          id: matchedMember.id,
          name: matchedMember.name,
          email: matchedMember.email,
          avatar: matchedMember.avatar,
          isOnline: true,
          role: 'member'
        };
      }
    }
    return null;
  }, [activeGroup, currentUser]);

  // Gestão da Lista de Desejos Real
  const handleAddWishlistItem = (newItem: Omit<WishlistItem, 'id' | 'likes'>) => {
    const item: WishlistItem = {
      ...newItem,
      id: `prod-${Date.now()}`,
      userId: currentUser ? currentUser.id : 'user',
      likes: 0
    };
    setWishlist(prev => [item, ...prev]);
    firestoreService.saveWishlistItem(item);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Item adicionado',
      message: `Você adicionou "${item.title}" à sua lista de desejos.`,
      timestamp: 'Agora mesmo',
      read: false,
      type: 'wishlist'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteWishlistItem = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const handleLikeWishlistItem = (id: string) => {
    setWishlist(prev => prev.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
  };

  // Envio de Mensagem Real no Chat (suporta Texto e ÁUDIO REAL)
  const handleSendMessage = (
    content: string, 
    isAnonymous: boolean, 
    recipientId?: string, 
    audioUrl?: string, 
    audioDuration?: string,
    attachmentUrl?: string,
    attachmentName?: string,
    attachmentType?: string
  ) => {
    const msgId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: msgId,
      groupId: activeGroup ? activeGroup.id : 'geral',
      senderId: currentUser ? currentUser.id : 'user',
      senderName: isAnonymous ? 'Amigo Secreto Anônimo 🎭' : (currentUser ? currentUser.name : 'Você'),
      senderAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isAnonymous,
      content,
      timestamp,
      recipientId,
      status: 'delivered',
      audioUrl,
      audioDuration,
      attachmentUrl,
      attachmentName,
      attachmentType
    };
    setChatMessages(prev => [...prev, newMessage]);
    firestoreService.saveChatMessage(newMessage);

    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === msgId ? {
        ...m,
        status: 'read',
        readAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
      } : m));
      sounds.playMessageReadSound();
    }, 1800);
  };

  const handleMarkMessageAsRead = (msgId?: string) => {
    sounds.playMessageReadSound();
    const nowTime = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    if (msgId) {
      setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read', readAt: nowTime } : m));
    } else {
      setChatMessages(prev => prev.map(m => ({ ...m, status: 'read', readAt: m.readAt || nowTime })));
    }
  };

  // Criação Real de Grupo (Salva no Firebase e abre modal de partilhar)
  const handleCreateGroup = (newGroupData: Omit<Group, 'id' | 'members' | 'participantsCount'>) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const creatorId = currentUser.id;
    const creatorName = currentUser.name;
    const creatorEmail = currentUser.email;
    const creatorAvatar = currentUser.avatar;

    const newGroup: Group = {
      ...newGroupData,
      id: `grp-${Date.now()}`,
      adminId: creatorId,
      participantsCount: 1,
      members: [
        {
          id: creatorId,
          name: creatorName,
          email: creatorEmail,
          avatar: creatorAvatar,
          wishlistCount: wishlist.length,
          isReady: true
        }
      ]
    };

    setGroups(prev => [newGroup, ...prev]);
    setActiveGroupId(newGroup.id);
    setActiveTab('groups');

    // Sincroniza com Firebase Cloud Firestore
    firestoreService.saveGroup(newGroup);

    // Abre imediatamente o modal de convite
    setSharingGroup(newGroup);
  };

  // Entrada Real num Grupo com Código de Convite (Sincronizado via Firebase)
  const handleJoinGroup = async (code: string, memberName: string, memberEmail: string) => {
    const cleanCode = code.trim().toUpperCase();
    let targetGroup = groups.find(g => g.code?.toUpperCase() === cleanCode);

    // Se ainda não estiver na memória local, pesquisa no Firestore em tempo real
    if (!targetGroup) {
      targetGroup = (await firestoreService.getGroupByCode(cleanCode)) || undefined;
    }

    if (targetGroup) {
      let activeUserId = currentUser ? currentUser.id : `user-${Date.now()}`;
      
      // Se não havia sessão aberta, regista o utilizador com os dados introduzidos
      if (!currentUser) {
        const autoUser: User = {
          id: activeUserId,
          name: memberName,
          email: memberEmail || `${memberName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=200&q=80`,
          isOnline: true,
          role: 'member'
        };
        setCurrentUser(autoUser);
        firestoreService.saveUser(autoUser);
      }

      const isAlreadyIn = targetGroup.members?.some(m => m.id === activeUserId || m.name.toLowerCase() === memberName.toLowerCase());

      if (isAlreadyIn) {
        alert(`Você já faz parte do grupo "${targetGroup.name}"!`);
        setActiveGroupId(targetGroup.id);
        setActiveTab('groups');
        return;
      }

      const newMember: GroupMember = {
        id: activeUserId,
        name: memberName,
        email: memberEmail || (currentUser ? currentUser.email : `${memberName.toLowerCase().replace(/\s+/g, '.')}@email.com`),
        avatar: currentUser ? currentUser.avatar : `https://images.unsplash.com/photo-${1534528741775 + (targetGroup.members.length * 1000)}?auto=format&fit=crop&w=120&q=80`,
        wishlistCount: 0,
        isReady: true
      };

      const updatedGroup: Group = {
        ...targetGroup,
        participantsCount: (targetGroup.members?.length || targetGroup.participantsCount) + 1,
        members: [...(targetGroup.members || []), newMember]
      };

      const existingIndex = groups.findIndex(g => g.id === targetGroup!.id);
      let updatedGroups: Group[];
      if (existingIndex >= 0) {
        updatedGroups = groups.map(g => g.id === targetGroup!.id ? updatedGroup : g);
      } else {
        updatedGroups = [updatedGroup, ...groups];
      }

      setGroups(updatedGroups);
      setActiveGroupId(targetGroup.id);
      setActiveTab('groups');

      await firestoreService.saveGroup(updatedGroup);

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Novo participante',
        message: `${memberName} entrou no grupo "${targetGroup.name}"! 🎉`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'group'
      };
      setNotifications(prev => [notif, ...prev]);

      alert(`Bem-vindo, ${memberName}! Você entrou no grupo "${targetGroup.name}" com sucesso! 🎁`);
    } else {
      alert(`Código de convite "${code}" não foi encontrado! Apenas quem foi convidado com um código válido pelo organizador pode entrar no grupo.`);
    }
  };

  // Adicionar Membro Diretamente ao Grupo (Sem simulação)
  const handleAddMember = (groupId: string, memberName: string, memberEmail: string) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;

    const newMemberId = `user-${Date.now()}`;
    const newMember: GroupMember = {
      id: newMemberId,
      name: memberName.trim(),
      email: memberEmail.trim() || `${memberName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (targetGroup.members.length * 1000)}?auto=format&fit=crop&w=120&q=80`,
      wishlistCount: 0,
      isReady: true
    };

    const updatedGroup: Group = {
      ...targetGroup,
      participantsCount: (targetGroup.members?.length || 0) + 1,
      members: [...(targetGroup.members || []), newMember]
    };

    const updatedGroups = groups.map(g => g.id === groupId ? updatedGroup : g);
    setGroups(updatedGroups);
    firestoreService.saveGroup(updatedGroup);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Participante Adicionado',
      message: `${memberName} foi adicionado ao grupo "${targetGroup.name}"!`,
      timestamp: 'Agora mesmo',
      read: false,
      type: 'group'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Remover Membro do Grupo
  const handleRemoveMember = (groupId: string, memberId: string) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;

    const updatedMembers = targetGroup.members.filter(m => m.id !== memberId);
    const updatedGroup: Group = {
      ...targetGroup,
      participantsCount: updatedMembers.length,
      members: updatedMembers
    };

    const updatedGroups = groups.map(g => g.id === groupId ? updatedGroup : g);
    setGroups(updatedGroups);
    firestoreService.saveGroup(updatedGroup);
  };

  // Realização Real do Sorteio (com Algoritmo Fechado onde ninguém tira a si mesmo)
  const handleTriggerDraw = (groupId: string) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;

    const currentCount = targetGroup.members ? targetGroup.members.length : targetGroup.participantsCount;
    if (currentCount < 2) {
      alert(`O grupo "${targetGroup.name}" precisa de pelo menos 2 participantes para realizar o sorteio! Adicione participantes ou convide amigos.`);
      return;
    }

    if (currentUser && targetGroup.adminId !== currentUser.id) {
      alert(`Apenas o criador do grupo pode realizar o sorteio.`);
      return;
    }

    // Algoritmo de Derangement: Ciclo fechado sem repetições
    const shuffled = [...targetGroup.members];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const updatedMembers = shuffled.map((m, idx) => ({
      ...m,
      assignedTo: shuffled[(idx + 1) % shuffled.length].id
    }));

    const updatedGroup: Group = { ...targetGroup, status: 'drawn' as const, members: updatedMembers };

    setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
    setActiveGroupId(groupId);
    setActiveTab('draw');

    firestoreService.saveGroup(updatedGroup);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Sorteio Concluído!',
      message: `O sorteio do grupo "${targetGroup.name}" foi realizado com sucesso! Toque na aba Sorteio para ver o seu amigo secreto.`,
      timestamp: 'Agora mesmo',
      read: false,
      type: 'draw'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleLogout = () => {
    firebaseAuthService.signOut();
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const isLight = theme === 'light';

  // Sincroniza classes no elemento raiz
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Fundo suave e sem ofuscamento
  const bgGradient = !isLight
    ? 'bg-[#06150f] text-slate-100'
    : 'bg-[#f0f4f2] text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${bgGradient} selection:bg-emerald-600 selection:text-white transition-colors duration-300 w-full overflow-x-hidden`}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
        onLogout={handleLogout}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar on desktop */}
        {activeTab !== 'landing' && activeTab !== 'auth' && !isMobilePreview && currentUser && (
          <div className="hidden lg:block shrink-0">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              theme={theme}
              activeGroup={activeGroup}
              unreadNotificationsCount={unreadNotifsCount}
              unreadMessagesCount={chatMessages.length}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Stage Content */}
        <main className={`flex-1 overflow-y-auto w-full ${
          isMobilePreview 
            ? isLight ? 'p-2 sm:p-6 bg-slate-100' : 'p-2 sm:p-6 bg-slate-950/40' 
            : activeTab === 'chat'
              ? 'p-0 md:p-3 h-[calc(100dvh-58px)] md:h-[calc(100vh-64px)] flex flex-col overflow-hidden'
              : activeTab !== 'landing' && activeTab !== 'auth'
                ? 'p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8'
                : 'p-3 sm:p-6 lg:p-8'
        }`}>
          <div className={`w-full ${activeTab === 'chat' ? 'h-full flex flex-col flex-1' : 'max-w-6xl mx-auto space-y-6 sm:space-y-8'}`}>
            {/* 1. Tela de Boas-Vindas */}
            {activeTab === 'landing' && (
              <WelcomeLandingView
                currentUser={currentUser}
                theme={theme}
                onCreateGroup={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsCreateGroupOpen(true);
                  }
                }}
                onJoinGroup={() => setIsJoinGroupOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onEnterDraw={() => setActiveTab('draw')}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setActiveTab('dashboard');
                }}
                onEnterApp={() => setActiveTab('dashboard')}
                onLogout={handleLogout}
              />
            )}

            {/* 2. Tela de Autenticação */}
            {activeTab === 'auth' && (
              <AuthCardView
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setActiveTab('dashboard');
                }}
                onNavigateToHome={() => setActiveTab('landing')}
              />
            )}

            {/* 3. Dashboard Principal Real */}
            {activeTab === 'dashboard' && currentUser && (
              <DashboardView
                currentUser={currentUser}
                groups={groups}
                activeGroup={activeGroup}
                notifications={notifications}
                theme={theme}
                setActiveTab={setActiveTab}
                onOpenDraw={() => setActiveTab('draw')}
                onSelectGroup={(g) => handleSelectGroup(g, 'groups')}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                onJoinGroup={() => setIsJoinGroupOpen(true)}
                wishlistCount={wishlist.length}
                messagesCount={chatMessages.length}
              />
            )}

            {/* 4. Os Meus Grupos Reais */}
            {activeTab === 'groups' && currentUser && (
              <GroupsView
                groups={groups}
                currentUser={currentUser}
                theme={theme}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                onJoinGroup={() => setIsJoinGroupOpen(true)}
                onSelectGroup={(g, targetTab) => handleSelectGroup(g, targetTab || 'draw')}
                onTriggerDraw={handleTriggerDraw}
                onShareGroup={(g) => setSharingGroup(g)}
              />
            )}

            {/* 5. Participantes do Grupo Ativo */}
            {activeTab === 'participants' && currentUser && (
              <ParticipantsView
                activeGroup={activeGroup}
                groups={groups}
                currentUser={currentUser}
                theme={theme}
                onNavigateToWishlist={() => setActiveTab('wishlist')}
                setActiveTab={setActiveTab}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onSelectGroup={(g) => handleSelectGroup(g, 'participants')}
                onShareGroup={(g) => setSharingGroup(g)}
              />
            )}

            {/* 6. Sorteio Real */}
            {activeTab === 'draw' && (
              <DrawView
                secretSantaMatch={currentSecretSantaMatch}
                theme={theme}
                activeGroup={activeGroup}
                groups={groups}
                currentUser={currentUser}
                onNavigateToChat={() => setActiveTab('chat')}
                setActiveTab={setActiveTab}
                onTriggerDraw={handleTriggerDraw}
                onSelectGroup={(g) => handleSelectGroup(g, 'draw')}
              />
            )}

            {/* 7. Chat Anônimo Bilar Conversas com Áudio Real */}
            {activeTab === 'chat' && currentUser && (
              <ChatView
                currentUser={currentUser}
                secretSantaMatch={currentSecretSantaMatch}
                messages={chatMessages}
                theme={theme}
                onSendMessage={handleSendMessage}
                activeGroup={activeGroup}
                onMarkAsRead={handleMarkMessageAsRead}
                onMarkAllAsRead={() => handleMarkMessageAsRead()}
                onNavigateToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {/* 8. Lista de Desejos Real */}
            {activeTab === 'wishlist' && currentUser && (
              <WishlistView
                wishlist={wishlist}
                currentUser={currentUser}
                theme={theme}
                onAddItem={handleAddWishlistItem}
                onDeleteItem={handleDeleteWishlistItem}
                onLikeItem={handleLikeWishlistItem}
              />
            )}

            {/* 9. Notificações Reais */}
            {activeTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                theme={theme}
                onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              />
            )}

            {/* 10. Definições Reais */}
            {activeTab === 'settings' && currentUser && (
              <SettingsView
                currentUser={currentUser}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onUpdateUser={(up) => setCurrentUser(prev => prev ? ({ ...prev, ...up }) : null)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Bottom Navigation — OCULTA NO CHAT PARA O CAMPO DE MENSAGENS NÃO SER COBERTO */}
      {activeTab !== 'auth' && activeTab !== 'landing' && activeTab !== 'chat' && currentUser && (
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-2 flex items-center justify-around ${
          isLight 
            ? 'bg-white border-slate-300 text-slate-800 shadow-lg' 
            : 'bg-[#08120e] border-emerald-950/80 text-emerald-200'
        }`}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'text-emerald-700' : isLight ? 'text-slate-600' : 'text-emerald-300/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('draw')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'draw' ? 'text-emerald-700' : isLight ? 'text-slate-600' : 'text-emerald-300/60'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Sorteio</span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'groups' ? 'text-emerald-700' : isLight ? 'text-slate-600' : 'text-emerald-300/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Grupos</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              isLight ? 'text-slate-600' : 'text-emerald-300/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'text-emerald-700' : isLight ? 'text-slate-600' : 'text-emerald-300/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Desejos</span>
          </button>
        </div>
      )}

      <PwaInstallPrompt theme={theme} />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        theme={theme}
        initialMode="login"
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
        }}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
        theme={theme}
      />

      <JoinGroupModal
        isOpen={isJoinGroupOpen}
        prefilledCode={joinCodePrefill}
        onClose={() => setIsJoinGroupOpen(false)}
        onJoinSuccess={handleJoinGroup}
        theme={theme}
      />

      <ShareGroupModal
        isOpen={!!sharingGroup}
        group={sharingGroup}
        onClose={() => setSharingGroup(null)}
        theme={theme}
      />

      {/* Official Footer — Exibido na Landing */}
      {activeTab === "landing" && (
        <footer className={`border-t px-4 sm:px-8 py-4 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-xs'
            : 'bg-[#040c08] border-emerald-950/80 text-emerald-300/80'
        }`}>
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" theme={theme} />
          </div>

          <div className={`flex items-center gap-3 sm:gap-4 text-xs font-semibold ${
            isLight ? 'text-slate-800' : 'text-emerald-100'
          }`}>
            <span>Amizade</span>
            <span>•</span>
            <span>Sigilo Absoluto</span>
            <span>•</span>
            <span>Partilha</span>
            <span>•</span>
            <span>Momentos Especiais</span>
          </div>

          <div className={`text-xs font-medium flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-emerald-200'
          }`}>
            <span>Bilar DigitalTech Solutions</span>
            <span className="text-red-500">❤️</span>
          </div>
        </footer>
      )}
    </div>
  );
}
