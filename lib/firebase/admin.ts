/* eslint-disable @typescript-eslint/no-explicit-any */
import rawAdmin from "firebase-admin";

const admin: any = rawAdmin;

let _adminApp: any = null;

function getOrInitAdminApp(): any {
  if (_adminApp) return _adminApp;

  const existingApps = admin.apps || (rawAdmin as any).apps || [];
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
      _adminApp = admin.initializeApp({
        credential: admin.credential.cert({
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

  _adminApp = admin.initializeApp({ projectId });
  return _adminApp;
}

export function getAdminAuth(): any {
  const app = getOrInitAdminApp();
  return admin.auth(app);
}

export function getAdminDb(): any {
  const app = getOrInitAdminApp();
  return admin.firestore(app);
}

export function getAdminStorage(): any {
  const app = getOrInitAdminApp();
  return admin.storage(app);
}

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
