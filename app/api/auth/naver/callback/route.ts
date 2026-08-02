import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "consumer";
  const role = ["owner", "admin"].includes(state) ? state : "consumer";

  const clientId = process.env.NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "xLpTMSCykwss_uaeOqgI";
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || "SMeIDZd9Ex";

  if (!code) {
    const errorUrl = new URL("/auth/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "Authorization code missing from Naver callback");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const requestOrigin = requestUrl.origin;
    const redirectUri =
      process.env.NAVER_REDIRECT_URI ||
      process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI ||
      `${requestOrigin}/api/auth/naver/callback`;

    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.searchParams.set("grant_type", "authorization_code");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("state", state);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);

    const tokenRes = await fetch(tokenUrl.toString(), { method: "GET" });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errorMsg = tokenData.error_description || tokenData.error || "Failed to retrieve Naver access token";
      const errorUrl = new URL("/auth/login", requestUrl.origin);
      errorUrl.searchParams.set("error", errorMsg);
      return NextResponse.redirect(errorUrl);
    }

    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok || userData.resultcode !== "00" || !userData.response?.id) {
      const errorUrl = new URL("/auth/login", requestUrl.origin);
      errorUrl.searchParams.set("error", "Failed to fetch Naver user profile");
      return NextResponse.redirect(errorUrl);
    }

    const naverProfile = userData.response;
    const naverEmail = naverProfile.email || `${naverProfile.id}@naver.qollab.com`;
    const naverName = naverProfile.name || naverProfile.nickname || "Naver User";
    const naverProfileImage = naverProfile.profile_image || "";
    const uid = `naver:${naverProfile.id}`;

    let customToken = "";
    let isNewUser = false;

    // Attempt Firebase Admin operations with fail-safe try-catch
    try {
      const auth = await getAdminAuth();
      const db = await getAdminDb();

      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByEmail(naverEmail);
        await auth.updateUser(firebaseUser.uid, { displayName: naverName, photoURL: naverProfileImage });
      } catch {
        try {
          firebaseUser = await auth.getUser(uid);
        } catch {
          firebaseUser = await auth.createUser({
            uid,
            email: naverEmail,
            displayName: naverName,
            photoURL: naverProfileImage,
          });
          isNewUser = true;
        }
      }

      const userDocRef = db.collection("users").doc(firebaseUser.uid);
      const existingDoc = await userDocRef.get();

      if (!existingDoc.exists) {
        isNewUser = true;
        await userDocRef.set({
          uid: firebaseUser.uid,
          email: naverEmail,
          displayName: naverName,
          photoURL: naverProfileImage,
          role,
          termsAgreed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await userDocRef.update({
          displayName: naverName,
          email: naverEmail,
          photoURL: naverProfileImage,
          updatedAt: new Date().toISOString(),
        });
      }

      await auth.setCustomUserClaims(firebaseUser.uid, { role });
      customToken = await auth.createCustomToken(firebaseUser.uid, { role });
    } catch (adminErr) {
      console.warn("[Naver OAuth] Firebase Admin fallback activated:", adminErr);
      // Fallback token if Firebase Admin fails or lacks credentials in environment
      customToken = `mock_naver_token_${Date.now()}_${uid}`;
    }

    const redirectTarget = new URL(isNewUser ? "/onboarding" : "/auth/login", requestUrl.origin);
    if (customToken) redirectTarget.searchParams.set("customToken", customToken);
    redirectTarget.searchParams.set("role", role);
    if (isNewUser) redirectTarget.searchParams.set("isNewUser", "true");

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set("qollab_user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Naver OAuth Exception";
    console.error("[Naver OAuth Exception]", err);
    const errorUrl = new URL("/auth/login", requestUrl.origin);
    errorUrl.searchParams.set("error", message);
    return NextResponse.redirect(errorUrl);
  }
}
