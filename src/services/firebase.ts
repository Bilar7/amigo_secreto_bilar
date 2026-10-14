/**
 * Bilar DigitalTech Solutions — Integração Oficial do Firebase
 * Projeto: jfb-amigo-secreto-pro-2026
 * Comunicação direta com Cloud Firestore via REST API com persistência local de alta performance
 */

import { Group, ChatMessage, WishlistItem, User } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Chaves oficiais da aplicação em produção
export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAIQPvGPnD5jVZ3Vn74BRfay53GfU39OII",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jfb-amigo-secreto-pro-2026.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jfb-amigo-secreto-pro-2026",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jfb-amigo-secreto-pro-2026.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "383975348496",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:383975348496:web:27bdd9bd098480c8c5ad95"
};

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export const firestoreService = {
  /**
   * Salvar ou atualizar grupo no Firestore com persistência local instantânea
   */
  async saveGroup(group: Group): Promise<boolean> {
    try {
      // 1. Salva localmente primeiro para resposta instantânea na UI
      const savedLocal = localStorage.getItem('bilar_groups');
      const groups: Group[] = savedLocal ? JSON.parse(savedLocal) : [];
      const updated = [group, ...groups.filter((g) => g.id !== group.id)];
      localStorage.setItem('bilar_groups', JSON.stringify(updated));

      // 2. Sincroniza com Firebase Cloud Firestore via REST API
      const url = `${FIRESTORE_BASE_URL}/groups/${encodeURIComponent(group.id)}?key=${firebaseConfig.apiKey}`;
      const payload = {
        fields: {
          id: { stringValue: group.id },
          name: { stringValue: group.name },
          code: { stringValue: group.code },
          occasion: { stringValue: group.occasion || 'geral' },
          description: { stringValue: group.description || '' },
          drawDate: { stringValue: group.drawDate || '' },
          drawDateFormatted: { stringValue: group.drawDateFormatted || '' },
          status: { stringValue: group.status || 'pending' },
          currency: { stringValue: group.currency || 'MZN' },
          suggestedBudget: { doubleValue: Number(group.suggestedBudget) || 3000 },
          adminId: { stringValue: group.adminId },
          participantsCount: { integerValue: String(group.members ? group.members.length : group.participantsCount) },
          dataJson: { stringValue: JSON.stringify(group) }
        }
      };

      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) {
      console.warn('[Firebase] Sincronização offline, salvo localmente com sucesso:', e);
      return true;
    }
  },

  /**
   * Buscar todos os grupos no Firestore com fallback para armazenamento local
   */
  async getGroups(): Promise<Group[]> {
    try {
      const url = `${FIRESTORE_BASE_URL}/groups?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const remoteGroups: Group[] = data.documents.map((doc: any) => {
            if (doc.fields?.dataJson?.stringValue) {
              try { 
                return JSON.parse(doc.fields.dataJson.stringValue); 
              } catch {}
            }
            return {
              id: doc.fields?.id?.stringValue,
              name: doc.fields?.name?.stringValue,
              code: doc.fields?.code?.stringValue,
              occasion: (doc.fields?.occasion?.stringValue as any) || 'geral',
              description: doc.fields?.description?.stringValue || '',
              drawDate: doc.fields?.drawDate?.stringValue || '',
              drawDateFormatted: doc.fields?.drawDateFormatted?.stringValue || '',
              status: (doc.fields?.status?.stringValue as any) || 'pending',
              suggestedBudget: Number(doc.fields?.suggestedBudget?.doubleValue) || 3000,
              currency: doc.fields?.currency?.stringValue || 'MZN',
              adminId: doc.fields?.adminId?.stringValue || '',
              participantsCount: Number(doc.fields?.participantsCount?.integerValue) || 1,
              maxParticipants: 20,
              members: []
            };
          });
          // Atualiza cache local
          localStorage.setItem('bilar_groups', JSON.stringify(remoteGroups));
          return remoteGroups;
        }
      }
    } catch (e) {
      console.warn('[Firebase] Não foi possível buscar grupos remotos, usando locais:', e);
    }

    const savedLocal = localStorage.getItem('bilar_groups');
    return savedLocal ? JSON.parse(savedLocal) : [];
  },

  /**
   * Buscar grupo específico por código de convite (consulta Firestore remoto + cache local)
   */
  async getGroupByCode(code: string): Promise<Group | null> {
    const cleanCode = code.trim().toUpperCase();
    
    // 1. Tentar ler do localStorage primeiro
    const savedLocal = localStorage.getItem('bilar_groups');
    if (savedLocal) {
      try {
        const localGroups: Group[] = JSON.parse(savedLocal);
        const match = localGroups.find(g => g.code?.toUpperCase() === cleanCode);
        if (match) return match;
      } catch {}
    }

    // 2. Consultar o Cloud Firestore remotamente em tempo real
    try {
      const url = `${FIRESTORE_BASE_URL}/groups?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.documents) {
          for (const doc of data.documents) {
            if (doc.fields?.dataJson?.stringValue) {
              try {
                const groupObj: Group = JSON.parse(doc.fields.dataJson.stringValue);
                if (groupObj.code?.toUpperCase() === cleanCode) {
                  // Atualiza a cache local
                  const currentSaved = localStorage.getItem('bilar_groups');
                  const currentList: Group[] = currentSaved ? JSON.parse(currentSaved) : [];
                  if (!currentList.some(g => g.id === groupObj.id)) {
                    localStorage.setItem('bilar_groups', JSON.stringify([groupObj, ...currentList]));
                  }
                  return groupObj;
                }
              } catch {}
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Firebase] Erro ao buscar grupo por código:', e);
    }

    return null;
  },

  /**
   * Salvar mensagem de chat
   */
  async saveChatMessage(msg: ChatMessage): Promise<boolean> {
    try {
      const savedLocal = localStorage.getItem('bilar_chat');
      const messages: ChatMessage[] = savedLocal ? JSON.parse(savedLocal) : [];
      localStorage.setItem('bilar_chat', JSON.stringify([...messages, msg]));

      const url = `${FIRESTORE_BASE_URL}/messages/${encodeURIComponent(msg.id)}?key=${firebaseConfig.apiKey}`;
      const payload = {
        fields: {
          id: { stringValue: msg.id },
          groupId: { stringValue: msg.groupId },
          senderId: { stringValue: msg.senderId },
          senderName: { stringValue: msg.senderName },
          isAnonymous: { booleanValue: msg.isAnonymous },
          content: { stringValue: msg.content },
          timestamp: { stringValue: msg.timestamp },
          status: { stringValue: msg.status || 'delivered' },
          audioUrl: { stringValue: msg.audioUrl || '' },
          audioDuration: { stringValue: msg.audioDuration || '' },
          attachmentUrl: { stringValue: msg.attachmentUrl || '' },
          attachmentName: { stringValue: msg.attachmentName || '' },
          attachmentType: { stringValue: msg.attachmentType || '' }
        }
      };

      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) {
      console.warn('[Firebase] Mensagem salva localmente:', e);
      return true;
    }
  },

  /**
   * Salvar item de lista de desejos
   */
  async saveWishlistItem(item: WishlistItem): Promise<boolean> {
    try {
      const savedLocal = localStorage.getItem('bilar_wishlist');
      const items: WishlistItem[] = savedLocal ? JSON.parse(savedLocal) : [];
      const updated = [item, ...items.filter(i => i.id !== item.id)];
      localStorage.setItem('bilar_wishlist', JSON.stringify(updated));

      const url = `${FIRESTORE_BASE_URL}/wishlists/${encodeURIComponent(item.id)}?key=${firebaseConfig.apiKey}`;
      const payload = {
        fields: {
          id: { stringValue: item.id },
          userId: { stringValue: item.userId },
          title: { stringValue: item.title },
          price: { doubleValue: Number(item.price) || 0 },
          currency: { stringValue: item.currency || 'MZN' },
          store: { stringValue: item.store || '' },
          category: { stringValue: item.category || 'Geral' },
          dataJson: { stringValue: JSON.stringify(item) }
        }
      };

      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  /**
   * Salvar perfil do utilizador
   */
  async saveUser(user: User): Promise<boolean> {
    try {
      localStorage.setItem('bilar_user', JSON.stringify(user));
      const url = `${FIRESTORE_BASE_URL}/users/${encodeURIComponent(user.id)}?key=${firebaseConfig.apiKey}`;
      const payload = {
        fields: {
          id: { stringValue: user.id },
          name: { stringValue: user.name },
          email: { stringValue: user.email },
          avatar: { stringValue: user.avatar }
        }
      };
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  /**
   * Testar status da conexão Firebase
   */
  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const url = `${FIRESTORE_BASE_URL}?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        return { connected: true, message: 'Conectado com sucesso ao Cloud Firestore (jfb-amigo-secreto-pro-2026)' };
      }
      return { connected: false, message: `Status HTTP ${res.status}: Aguardando publicação de regras no console Firebase` };
    } catch (e: any) {
      return { connected: false, message: 'Operando em modo de cache local resiliente' };
    }
  }
};

export default firebaseConfig;
