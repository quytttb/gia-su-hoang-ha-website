import fs from 'fs';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

/**
 * Initialize Firestore via firebase-admin for build/migration scripts.
 * Returns null if credentials are not configured.
 */
export function initAdminFirestore() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  let serviceAccount = null;

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    serviceAccount = {
      type: 'service_account',
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
    };
  } else {
    const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (filePath && fs.existsSync(filePath)) {
      serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }

  if (!serviceAccount?.private_key || !serviceAccount?.client_email) {
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.VITE_FIREBASE_PROJECT_ID,
  });

  return admin.firestore();
}

export function toIsoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (typeof value === 'string') return new Date(value).toISOString().slice(0, 10);
  if (value.toDate) return value.toDate().toISOString().slice(0, 10);
  if (value.seconds) return new Date(value.seconds * 1000).toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}
