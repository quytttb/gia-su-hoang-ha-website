import { env } from '@/lib/env';

// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = env.gaTrackingId;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track class interactions
export const trackClassView = (classId: string, className: string) => {
  trackEvent('view_class', 'classes', `${classId}-${className}`);
};

export const trackClassRegistration = (classId: string, className: string) => {
  trackEvent('class_registration', 'conversions', `${classId}-${className}`);
};

// Track contact form submissions
export const trackContactForm = (formType: 'contact' | 'registration') => {
  trackEvent('form_submit', 'engagement', formType);
};

// Track user engagement
export const trackUserEngagement = (action: string, element: string) => {
  trackEvent(action, 'engagement', element);
};

// Track performance metrics
export const trackPerformance = () => {
  if (!window.gtag) return;

  // Track Core Web Vitals
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
    onCLS((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'CLS',
        value: Math.round(metric.value * 1000),
        non_interaction: true,
      });
    });

    onFCP((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'FCP',
        value: Math.round(metric.value),
        non_interaction: true,
      });
    });

    onLCP((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'LCP',
        value: Math.round(metric.value),
        non_interaction: true,
      });
    });

    onTTFB((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'TTFB',
        value: Math.round(metric.value),
        non_interaction: true,
      });
    });
  });
};
