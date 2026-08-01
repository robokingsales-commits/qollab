import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

function ensureAdminInitialized(): App {
  if (getApps().length > 0 && getApps()[0]) {
    return getApps()[0];
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_CLIENT_EMAIL;

  let privateKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey || privateKey.includes("your-private-key")) {
    return initializeApp({
      projectId: projectId || "demo-project",
    });
  }

  privateKey = privateKey.replace(/\\n/g, "\n");
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Firebase Admin Initialize App Error:", error);
    throw new Error(`Firebase Admin 초기화 실패: ${msg}`);
  }
}

export function getAdminAuth(): Auth {
  const app = ensureAdminInitialized();
  const auth = getAuth(app);
  if (!auth) {
    throw new Error("[Firebase Admin Error] Auth instance is null");
  }
  return auth;
}

export function getAdminDb(): Firestore {
  const app = ensureAdminInitialized();
  const db = getFirestore(app);
  if (!db) {
    throw new Error("[Firebase Admin Error] Firestore instance is null");
  }
  return db;
}

export function getAdminStorage(): Storage {
  const app = ensureAdminInitialized();
  const storage = getStorage(app);
  if (!storage) {
    throw new Error("[Firebase Admin Error] Storage instance is null");
  }
  return storage;
}

const adminApp: App = ensureAdminInitialized();
const adminAuth: Auth = getAdminAuth();
const adminDb: Firestore = getAdminDb();
const adminStorage: Storage = getAdminStorage();

export { adminApp, adminAuth, adminDb, adminStorage };
