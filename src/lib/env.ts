export const isDevelopment = process.env.NODE_ENV === 'development';

export const env = {
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  emailJsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  emailJsTemplateIdContact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || '',
  emailJsTemplateIdRegistration: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION || '',
  emailJsTemplateIdAutoReply: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY || '',
  emailJsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
} as const;

export const hasFirebasePublicConfig =
  Boolean(env.firebaseApiKey) &&
  Boolean(env.firebaseProjectId) &&
  Boolean(env.firebaseAppId) &&
  env.firebaseProjectId !== 'dummy-project';
