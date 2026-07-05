import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationContextType {
  newMessagesCount: number;
  recentMessages: any[];
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
