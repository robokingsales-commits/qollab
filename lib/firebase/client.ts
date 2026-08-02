import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:123456789",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return await signInWithPopup(auth, provider);
};

export const loginWithGoogleRedirect = (role: string = "consumer") => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    "https://qollab-gules.vercel.app/api/auth/callback/google";

  if (clientId && !clientId.includes("your-google-client-id")) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent("openid email profile")}&state=${role}`;
    window.location.href = googleAuthUrl;
    return true;
  }
  return false;
};

export const loginWithKakao = (role: string = "consumer") => {
  let clientId =
    process.env.KAKAO_CLIENT_ID ||
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ||
    "f374580fcc0ee2e4f29fdd081d1e390b";

  if (clientId.includes("fccoee")) {
    clientId = "f374580fcc0ee2e4f29fdd081d1e390b";
  }

  let redirectUri =
    process.env.KAKAO_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!redirectUri) {
    if (typeof window !== "undefined") {
      redirectUri = `${window.location.origin}/api/auth/kakao/callback`;
    } else {
      redirectUri = "https://qollab-gules.vercel.app/api/auth/kakao/callback";
    }
  }

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&state=${role}`;
  window.location.href = kakaoAuthUrl;
};

export const loginWithNaver = (role: string = "consumer") => {
  const clientId =
    process.env.NAVER_CLIENT_ID ||
    process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ||
    "xLpTMSCykwss_uaeOqgI";
  
  let redirectUri =
    process.env.NAVER_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

  if (!redirectUri) {
    if (typeof window !== "undefined") {
      redirectUri = `${window.location.origin}/api/auth/naver/callback`;
    } else {
      redirectUri = "https://qollab-gules.vercel.app/api/auth/naver/callback";
    }
  }

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${role}`;
  window.location.href = naverAuthUrl;
};

export { app, auth, db, storage, signInWithCustomToken };
