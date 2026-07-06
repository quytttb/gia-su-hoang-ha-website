export const isDevelopment = process.env.NODE_ENV === 'development';

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  emailJsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  emailJsTemplateIdContact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || '',
  emailJsTemplateIdRegistration: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION || '',
  emailJsTemplateIdAutoReply: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY || '',
  emailJsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
} as const;

export const hasSupabaseConfig =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey) && Boolean(env.databaseUrl);
