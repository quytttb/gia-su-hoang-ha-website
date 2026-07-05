import { trackEvent } from './analytics';

// Scroll tracking
export const trackScrollDepth = () => {
  let maxScroll = 0;
  const scrollThresholds = [25, 50, 75, 90, 100];
  const trackedThresholds = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }

    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        trackEvent('scroll_depth', 'engagement', `${threshold}_percent`, threshold);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Track final scroll depth on page unload
  window.addEventListener('beforeunload', () => {
    if (maxScroll > 0) {
      trackEvent('max_scroll_depth', 'engagement', 'page_exit', maxScroll);
    }
  });
};

// Time on page tracking
export const trackTimeOnPage = () => {
  const startTime = Date.now();
  const timeThresholds = [10, 30, 60, 120, 300]; // seconds
  const trackedThresholds = new Set<number>();

  const checkTimeThresholds = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    timeThresholds.forEach(threshold => {
      if (timeSpent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        trackEvent('time_on_page', 'engagement', `${threshold}_seconds`, threshold);
      }
    });
  };

  // Check every 10 seconds
  const interval = setInterval(checkTimeThresholds, 10000);

  // Track final time on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    const finalTime = Math.round((Date.now() - startTime) / 1000);
    trackEvent('total_time_on_page', 'engagement', 'page_exit', finalTime);
  });
};

// Click heatmap tracking
export const trackClickHeatmap = () => {
  document.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const className = target.className;
    const id = target.id;
    const text = target.textContent?.slice(0, 50) || '';

    // Track different types of clicks
    if (tagName === 'button') {
      trackEvent('button_click', 'interaction', `${id || className || text}`);
    } else if (tagName === 'a') {
      const href = (target as HTMLAnchorElement).href;
      trackEvent('link_click', 'interaction', href);
    } else if (target.closest('form')) {
      trackEvent('form_interaction', 'interaction', tagName);
    } else {
      trackEvent('element_click', 'interaction', `${tagName}_${className || id || 'unknown'}`);
    }

    // Track click coordinates for heatmap
    const x = Math.round((event.clientX / window.innerWidth) * 100);
    const y = Math.round((event.clientY / window.innerHeight) * 100);

    trackEvent('click_coordinates', 'heatmap', `${x}_${y}`);
  });
};

// Form interaction tracking
export const trackFormInteractions = () => {
  // Track form field focus
  document.addEventListener('focusin', event => {
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      const fieldName =
        (target as HTMLInputElement).name || (target as HTMLInputElement).id || 'unknown';
      trackEvent('form_field_focus', 'form', fieldName);
    }
  });

  // Track form submission attempts
  document.addEventListener('submit', event => {
    const form = event.target as HTMLFormElement;
    const formName = form.name || form.id || form.className || 'unknown';
    trackEvent('form_submit_attempt', 'form', formName);
  });

  // Track form abandonment
  let formInteractionStarted = false;
  document.addEventListener('focusin', event => {
    const target = event.target as HTMLElement;
    if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && !formInteractionStarted) {
      formInteractionStarted = true;

      window.addEventListener('beforeunload', () => {
        if (formInteractionStarted) {
          trackEvent('form_abandonment', 'form', 'page_exit');
        }
      });
    }
  });
};

// Search behavior tracking
export const trackSearchBehavior = (searchTerm: string, results: number, filters?: string[]) => {
  trackEvent('search_performed', 'search', searchTerm, results);

  if (filters && filters.length > 0) {
    trackEvent('search_with_filters', 'search', filters.join(','));
  }

  if (results === 0) {
    trackEvent('search_no_results', 'search', searchTerm);
  }
};

// Error tracking
export const trackUserError = (errorType: string, errorMessage: string) => {
  trackEvent('user_error', 'error', errorType);

  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: `User Error: ${errorType} - ${errorMessage}`,
      fatal: false,
    });
  }
};

// Device and browser tracking
export const trackDeviceInfo = () => {
  const deviceInfo = {
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    device_pixel_ratio: window.devicePixelRatio,
    color_depth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    user_agent: navigator.userAgent.slice(0, 100), // Truncated for privacy
  };

  Object.entries(deviceInfo).forEach(([key, value]) => {
    trackEvent('device_info', 'technical', `${key}_${value}`);
  });
};

// Performance tracking
export const trackUserPerformanceMetrics = () => {
  // Track page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;

      trackEvent('page_load_time', 'performance', 'load_complete', Math.round(loadTime));

      // Track specific performance metrics
      const metrics = {
        dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_connection: navigation.connectEnd - navigation.connectStart,
        server_response: navigation.responseStart - navigation.requestStart,
        dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      };

      Object.entries(metrics).forEach(([metric, value]) => {
        trackEvent('performance_breakdown', 'performance', metric, Math.round(value));
      });
    }, 1000);
  });
};

// Initialize all tracking
export const initializeUserInteractionTracking = () => {
  trackScrollDepth();
  trackTimeOnPage();
  trackClickHeatmap();
  trackFormInteractions();
  trackDeviceInfo();
  trackUserPerformanceMetrics();
};
