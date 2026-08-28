import {
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are required.",
  );
}

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
          `${projectId}.firebasestorage.app`,
      });

export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);