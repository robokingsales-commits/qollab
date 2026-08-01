/* eslint-disable @typescript-eslint/no-explicit-any */
import adminModule from "firebase-admin";

const admin: any = (adminModule as any).default || adminModule;

function initAdminApp(): any {
  const apps = admin.apps || (adminModule as any).apps || [];
  if (apps && apps.length > 0 && apps[0]) {
    return apps[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  const initialize = admin.initializeApp || (adminModule as any).initializeApp;
  const certFn = (admin.credential && admin.credential.cert) || (adminModule as any).cert;

  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    privateKey &&
    !privateKey.includes("your-private-key")
  ) {
    try {
      return initialize({
        credential: certFn({
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

  return initialize({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  });
}

const adminApp: any = initAdminApp();

const authFn = admin.auth || (adminModule as any).auth;
const firestoreFn = admin.firestore || (adminModule as any).firestore;
const storageFn = admin.storage || (adminModule as any).storage;

const adminAuth: any = authFn ? authFn(adminApp) : null;
const adminDb: any = firestoreFn ? firestoreFn(adminApp) : null;
const adminStorage: any = storageFn ? storageFn(adminApp) : null;

export { adminApp, adminAuth, adminDb, adminStorage };
