import { create } from 'zustand';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface RecentMessage {
  id: string;
  name: string;
  message: string;
  createdAt?: { toDate?: () => Date } | string;
}

interface NotificationStore {
  newMessagesCount: number;
  recentMessages: RecentMessage[];
  refreshNotifications: () => Promise<void>;
}

const fetchNewMessagesCount = async (): Promise<number> => {
  if (!db) return 0;
  const messagesQuery = query(collection(db, 'contacts'), where('status', '==', 'new'));
  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.length;
};

const toDate = (value: RecentMessage['createdAt']): Date => {
  if (value && typeof value === 'object' && 'toDate' in value && value.toDate) {
    return value.toDate();
  }
  return new Date((value as string) || 0);
};

const fetchRecentMessages = async (): Promise<RecentMessage[]> => {
  if (!db) return [];
  const messagesQuery = query(collection(db, 'contacts'), where('status', '==', 'new'), limit(5));
  const snapshot = await getDocs(messagesQuery);
  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as RecentMessage[];
  return messages.sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
};

export const useNotificationStore = create<NotificationStore>(set => ({
  newMessagesCount: 0,
  recentMessages: [],
  refreshNotifications: async () => {
    try {
      const [newMessagesCount, recentMessages] = await Promise.all([
        fetchNewMessagesCount(),
        fetchRecentMessages(),
      ]);
      set({ newMessagesCount, recentMessages });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  },
}));

let notificationInterval: ReturnType<typeof setInterval> | null = null;

export const startNotificationPolling = () => {
  if (notificationInterval) return;
  const { refreshNotifications } = useNotificationStore.getState();
  refreshNotifications();
  notificationInterval = setInterval(refreshNotifications, 5000);
};

export const stopNotificationPolling = () => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
};
