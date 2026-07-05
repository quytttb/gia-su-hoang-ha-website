import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useNotifications = () => {
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  // Fetch new messages count
  const fetchNewMessagesCount = useCallback(async () => {
    try {
      if (!db) return;

      const messagesQuery = query(collection(db, 'contacts'), where('status', '==', 'new'));

      const snapshot = await getDocs(messagesQuery);
      setNewMessagesCount(snapshot.docs.length);
    } catch (error) {
      console.error('Error fetching new messages count:', error);
    }
  }, []);

  // Fetch recent messages
  const fetchRecentMessages = useCallback(async () => {
    try {
      if (!db) return;

      const messagesQuery = query(
        collection(db, 'contacts'),
        where('status', '==', 'new'),
        limit(5)
      );

      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      // Sort in memory instead of Firestore to avoid index requirement
      messages.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bTime.getTime() - aTime.getTime();
      });
      setRecentMessages(messages);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    }
  }, []);

  // Refresh function
  const refreshNotifications = useCallback(() => {
    fetchNewMessagesCount();
    fetchRecentMessages();
  }, [fetchNewMessagesCount, fetchRecentMessages]);

  // Auto-fetch on mount and set interval
  useEffect(() => {
    refreshNotifications();

    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(refreshNotifications, 5000);

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return {
    newMessagesCount,
    recentMessages,
    refreshNotifications,
  };
};
