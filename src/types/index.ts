export type GroupOccasion = 
  | 'geral'
  | 'empresa'
  | 'aniversario'
  | 'fim_ano'
  | 'natal'
  | 'amigos';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  role: 'admin' | 'member';
}

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  price: number;
  currency: string;
  store: string;
  storeUrl?: string;
  imageUrl: string;
  category: string;
  reservedBy?: string;
  likes: number;
  priority: 'baixa' | 'media' | 'alta';
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  wishlistCount: number;
  isReady: boolean;
  assignedTo?: string; // ID of the person they need to gift
}

export interface Group {
  id: string;
  name: string;
  occasion: GroupOccasion;
  description: string;
  participantsCount: number;
  maxParticipants: number;
  drawDate: string; // ISO or date string
  drawDateFormatted: string;
  status: 'active' | 'drawn' | 'pending';
  currency: string;
  suggestedBudget?: number;
  code: string;
  adminId: string;
  members: GroupMember[];
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isAnonymous: boolean;
  content: string;
  timestamp: string;
  recipientId?: string;
  status?: 'sending' | 'delivered' | 'read';
  readAt?: string;
  audioUrl?: string;
  audioDuration?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'wishlist' | 'chat' | 'draw' | 'group';
  avatar?: string;
}

export type ThemeMode = 'light' | 'dark';

export type ActiveTab = 
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'groups'
  | 'participants'
  | 'chat'
  | 'wishlist'
  | 'draw'
  | 'notifications'
  | 'settings';
