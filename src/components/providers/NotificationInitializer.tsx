'use client';

import { useEffect } from 'react';
import { startNotificationPolling, stopNotificationPolling } from '@/stores/useNotificationStore';

const NotificationInitializer = () => {
  useEffect(() => {
    startNotificationPolling();
    return () => stopNotificationPolling();
  }, []);

  return null;
};

export default NotificationInitializer;
