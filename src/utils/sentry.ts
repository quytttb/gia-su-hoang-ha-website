import * as Sentry from '@sentry/react';
import { env } from '@/lib/env';

const SENTRY_DSN = env.sentryDsn;
const ENVIRONMENT = env.environment;

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not found, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    // Release tracking
    release: env.appVersion,
    // User context
    beforeSend(event) {
      // Filter out non-critical errors in development
      if (ENVIRONMENT === 'development') {
        console.log('Sentry event:', event);
      }
      return event;
    },
  });
};

// Custom error boundary
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Manual error reporting
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

// User identification
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

// Add breadcrumb
export const addBreadcrumb = (message: string, category: string) => {
  Sentry.addBreadcrumb({
    message,
    category,
    timestamp: Date.now() / 1000,
  });
};
