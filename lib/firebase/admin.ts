import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let _adminApp: App | null = null;

function getOrInitAdminApp(): App {
  if (_adminApp) return _adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    _adminApp = existingApps[0];
    return _adminApp;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "qollab-e5316";

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_CLIENT_EMAIL;

  let privateKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
  }

  if (projectId && clientEmail && privateKey && !privateKey.includes("your-private-key")) {
    try {
      _adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
      });
      return _adminApp;
    } catch (e) {
      console.warn("[Firebase Admin] Cert init failed, using fallback:", e);
    }
  }

  _adminApp = initializeApp({ projectId });
  return _adminApp;
}

export function getAdminAuth(): Auth {
  const app = getOrInitAdminApp();
  return getAuth(app);
}

export function getAdminDb(): Firestore {
  const app = getOrInitAdminApp();
  return getFirestore(app);
}

export function getAdminStorage(): Storage {
  const app = getOrInitAdminApp();
  return getStorage(app);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const adminApp: any = new Proxy({} as any, {
  get(_, prop) {
    return (getOrInitAdminApp() as any)[prop];
  },
});

export const adminAuth: any = new Proxy({} as any, {
  get(_, prop) {
    return (getAdminAuth() as any)[prop];
  },
});

export const adminDb: any = new Proxy({} as any, {
  get(_, prop) {
    return (getAdminDb() as any)[prop];
  },
});

export const adminStorage: any = new Proxy({} as any, {
  get(_, prop) {
    return (getAdminStorage() as any)[prop];
  },
});
