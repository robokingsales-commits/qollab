/* eslint-disable @typescript-eslint/no-explicit-any */

let _adminApp: any = null;

async function getOrInitAdminApp(): Promise<any> {
  if (_adminApp) return _adminApp;

  try {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");

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
  } catch (err) {
    console.error("[Firebase Admin Load Error]", err);
    return null;
  }
}

export async function getAdminAuth(): Promise<any> {
  const app = await getOrInitAdminApp();
  if (!app) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return getAuth(app);
  } catch (e) {
    console.warn("[Firebase Admin Auth Load Failed]", e);
    return null;
  }
}

export async function getAdminDb(): Promise<any> {
  const app = await getOrInitAdminApp();
  if (!app) return null;
  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    return getFirestore(app);
  } catch (e) {
    console.warn("[Firebase Admin Db Load Failed]", e);
    return null;
  }
}

export async function getAdminStorage(): Promise<any> {
  const app = await getOrInitAdminApp();
  if (!app) return null;
  try {
    const { getStorage } = await import("firebase-admin/storage");
    return getStorage(app);
  } catch (e) {
    console.warn("[Firebase Admin Storage Load Failed]", e);
    return null;
  }
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
