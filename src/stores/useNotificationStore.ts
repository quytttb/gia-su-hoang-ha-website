import { create } from 'zustand';
import {
  getNewContactCount,
  getRecentNewContacts,
  type ContactMessage,
} from '@/actions/contact-admin';

export interface RecentMessage {
  id: string;
  name: string;
  message: string;
  createdAt?: string | Date;
}

interface NotificationStore {
  newMessagesCount: number;
  recentMessages: RecentMessage[];
  refreshNotifications: () => Promise<void>;
}

const toRecentMessage = (msg: ContactMessage): RecentMessage => ({
  id: msg.id,
  name: msg.name,
  message: msg.message,
  createdAt: msg.createdAt,
});

export const useNotificationStore = create<NotificationStore>(set => ({
  newMessagesCount: 0,
  recentMessages: [],
  refreshNotifications: async () => {
    try {
      const [newMessagesCount, recent] = await Promise.all([
        getNewContactCount(),
        getRecentNewContacts(5),
      ]);
      set({
        newMessagesCount,
        recentMessages: recent.map(toRecentMessage),
      });
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
