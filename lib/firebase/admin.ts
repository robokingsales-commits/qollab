import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

function initAdminApp(): App {
  if (getApps().length > 0 && getApps()[0]) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    privateKey &&
    !privateKey.includes("your-private-key")
  ) {
    try {
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with cert, using fallback", e);
    }
  }

  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID || "demo-project",
  });
}

const adminApp: App = initAdminApp();

export function getAdminAuth(): Auth {
  return getAuth(adminApp);
}

export function getAdminDb(): Firestore {
  return getFirestore(adminApp);
}

export function getAdminStorage(): Storage {
  return getStorage(adminApp);
}

const adminAuth: Auth = getAdminAuth();
const adminDb: Firestore = getAdminDb();
const adminStorage: Storage = getAdminStorage();

export { adminApp, adminAuth, adminDb, adminStorage };
