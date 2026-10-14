import { User, Group, WishlistItem, ChatMessage, AppNotification } from '../types';

export const currentUser: User = {
  id: '',
  name: '',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isOnline: false,
  role: 'member'
};

export const secretSantaMatch: User = {
  id: '',
  name: '',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  isOnline: false,
  role: 'member'
};

export const initialGroups: Group[] = [];
export const initialWishlist: WishlistItem[] = [];
export const initialChatMessages: ChatMessage[] = [];
export const initialNotifications: AppNotification[] = [];

export const getWishlistForUser = (_userId: string): WishlistItem[] => [];
