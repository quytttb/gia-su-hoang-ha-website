/**
 * Cấu hình vô hiệu hóa Google Analytics và Firebase Installations
 * khi gặp lỗi 403 PERMISSION_DENIED
 */

import { setAnalyticsCollectionEnabled, Analytics } from 'firebase/analytics';
import { analytics } from './firebase';
import { isDevelopment } from '@/lib/env';

/**
 * Vô hiệu hóa việc thu thập dữ liệu Analytics
 * Cần gọi hàm này sau khi Firebase được khởi tạo
 */
export const disableAnalyticsCollection = () => {
  try {
    // Sử dụng type assertion để tránh lỗi linter
    const analyticsInstance = analytics as Analytics | null;
    if (analyticsInstance) {
      setAnalyticsCollectionEnabled(analyticsInstance, false);
      console.log('Google Analytics data collection disabled');
    }
  } catch (error) {
    console.warn('Failed to disable Analytics collection:', error);
  }
};

/**
 * Vô hiệu hóa tự động Analytics trên các trang
 * trong môi trường phát triển để tránh lỗi 403
 */
export const setupAnalyticsForDevelopment = () => {
  if (isDevelopment) {
    disableAnalyticsCollection();
    console.log('Analytics disabled in development environment');
  }
};

/**
 * Hook vào window.fetch để chặn các yêu cầu Firebase Installations
 * Giải pháp triệt để khi các biện pháp khác không hoạt động
 */
export const blockFirebaseInstallationsRequests = () => {
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;

    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      const url = input.toString();

      // Chặn các yêu cầu đến Firebase Installations và Analytics Config
      if (
        url.includes('firebaseinstallations.googleapis.com') ||
        url.includes('firebase.googleapis.com/v1alpha/projects')
      ) {
        console.log('⛔ Blocked Firebase request to:', url);

        // Trả về promise đã giải quyết với phản hồi giả
        return Promise.resolve(
          new Response(
            JSON.stringify({
              blocked: true,
              message: 'Request blocked by application',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }

      // Cho phép tất cả các yêu cầu khác
      return originalFetch.apply(this, [input, init]);
    };

    console.log('📶 Firebase network request blocker enabled');
  }
};

// Tự động thiết lập trong môi trường phát triển
if (isDevelopment) {
  setupAnalyticsForDevelopment();
  blockFirebaseInstallationsRequests();
}
