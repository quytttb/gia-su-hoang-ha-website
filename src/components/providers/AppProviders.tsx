'use client';

import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AnalyticsTracker from '@/components/shared/AnalyticsTracker';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import ThemeInitializer from '@/components/providers/ThemeInitializer';
import NotificationInitializer from '@/components/providers/NotificationInitializer';
interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <QueryProvider>
      <NuqsAdapter>
        <ThemeInitializer />
        <NotificationInitializer />
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </NuqsAdapter>
    </QueryProvider>
  </ErrorBoundary>
);

export default AppProviders;
