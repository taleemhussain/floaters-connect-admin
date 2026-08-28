import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const projectId = import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket:
    import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.firebasestorage.app` : undefined),
  messagingSenderId:
    import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
})) {
  if (!value) {
    throw new Error(`Missing Firebase web configuration: ${key}`);
  }
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { app };