'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView, trackPerformance } from '../../utils/analytics';
import { initializeUserInteractionTracking } from '../../utils/userInteractionTracking';

const AnalyticsTracker = () => {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
    trackPerformance();
    initializeUserInteractionTracking();
  }, []);

  // Track page views on route change
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Trang Chủ - Trung Tâm Gia Sư Hoàng Hà',
      '/about': 'Giới Thiệu - Trung Tâm Gia Sư Hoàng Hà',
      '/classes': 'Khóa Học - Trung Tâm Gia Sư Hoàng Hà',
      '/schedule': 'Lịch Học - Trung Tâm Gia Sư Hoàng Hà',
      '/contact': 'Liên Hệ - Trung Tâm Gia Sư Hoàng Hà',
      '/panel': 'Panel - Trung Tâm Gia Sư Hoàng Hà',
    };

    // Get page title
    let pageTitle = pageTitles[pathname];

    // Handle dynamic routes
    if (pathname.startsWith('/classes/') && pathname.includes('/register')) {
      pageTitle = 'Đăng Ký Khóa Học - Trung Tâm Gia Sư Hoàng Hà';
    } else if (pathname.startsWith('/classes/')) {
      pageTitle = 'Chi Tiết Khóa Học - Trung Tâm Gia Sư Hoàng Hà';
    }

    // Track page view
    const query = searchParams?.toString() ?? '';
    trackPageView(query ? `${pathname}?${query}` : pathname, pageTitle);
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
