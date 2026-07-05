'use client';

import { Suspense } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AnalyticsTracker from '@/components/shared/AnalyticsTracker';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import '@/utils/firebaseCheck';
import '@/config/analyticsConfig';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
            {children}
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default AppProviders;
