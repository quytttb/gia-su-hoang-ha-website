import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { Installations } from 'firebase/installations';
import { env, isDevelopment } from '@/lib/env';

// Debug token cho App Check khi dev (lấy từ Firebase Console → App Check → Manage debug tokens)
if (isDevelopment && typeof window !== 'undefined') {
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    true;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: env.firebaseApiKey || 'dummy-key',
  authDomain: env.firebaseAuthDomain || 'dummy-domain.firebaseapp.com',
  projectId: env.firebaseProjectId || 'dummy-project',
  storageBucket: env.firebaseStorageBucket || 'dummy-bucket.appspot.com',
  messagingSenderId: env.firebaseMessagingSenderId || '123456789012',
  appId: env.firebaseAppId || '1:123456789012:web:abcdef123456',
  measurementId: env.firebaseMeasurementId || 'G-ABCDEFGHIJ',
};

// Initialize Firebase (conditionally)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let installations: Installations | null = null;

try {
  // Khởi tạo app
  app = initializeApp(firebaseConfig);

  // App Check — bảo vệ Firestore/Auth API khỏi abuse (bật enforce từ từ trên Firebase Console)
  if (typeof window !== 'undefined') {
    const siteKey = env.recaptchaSiteKey;
    if (siteKey) {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
        console.log('Firebase App Check initialized');
      } catch (appCheckError) {
        console.warn('Firebase App Check initialization failed:', appCheckError);
      }
    } else if (!isDevelopment) {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY chưa cấu hình — App Check chưa bật');
    }
  }

  // Khởi tạo Auth
  auth = getAuth(app);

  // Khởi tạo Firestore
  db = getFirestore(app);

  // Khởi tạo Analytics chỉ khi không ở môi trường phát triển
  if (!isDevelopment && typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } catch {
      // Analytics may not be available in some environments (e.g., localhost)
      console.warn('Firebase Analytics not available');
    }
  } else {
    console.log('Firebase Analytics initialized (data collection disabled)');
    analytics = null;
  }

  // Không sử dụng Installations vì gây lỗi 403
  installations = null;
  console.log('Firebase Installations skipped (to avoid 403 errors)');

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create dummy objects to prevent app crashes
  app = null;
  auth = null;
  db = null;
  analytics = null;
  installations = null;
}

// Export the services
export { auth, db, analytics, installations };

export default app;
