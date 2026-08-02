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

  let clientId = process.env.KAKAO_CLIENT_ID || process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "f374580fcc0ee2e4f29fdd081d1e390b";
  if (clientId.includes("fccoee")) {
    clientId = "f374580fcc0ee2e4f29fdd081d1e390b";
  }
  const redirectUri =
    process.env.KAKAO_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
    `${requestUrl.origin}/api/auth/kakao/callback`;

  const clientSecret = process.env.KAKAO_CLIENT_SECRET || "KKPBE4RPpwHQ0kjxUphXvGFksrphGVjr";

  if (!code) {
    const errorUrl = new URL("/auth/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "Missing authorization code");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errorMsg = tokenData.error_description || tokenData.error || "Failed to retrieve Kakao access token";
      const errorUrl = new URL("/auth/login", requestUrl.origin);
      errorUrl.searchParams.set("error", errorMsg);
      return NextResponse.redirect(errorUrl);
    }

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok || !userData.id) {
      const errorUrl = new URL("/auth/login", requestUrl.origin);
      errorUrl.searchParams.set("error", "Failed to fetch Kakao user profile");
      return NextResponse.redirect(errorUrl);
    }

    const uid = `kakao:${userData.id}`;
    const email = userData.kakao_account?.email || `${userData.id}@kakao.qollab.com`;
    const displayName = userData.kakao_account?.profile?.nickname || "카카오 사용자";
    const photoURL = userData.kakao_account?.profile?.profile_image_url || "";

    let isNewUser = false;
    let customToken = "";

    try {
      const auth = await getAdminAuth();
      const db = await getAdminDb();

      if (auth && db) {
        try {
          await auth.getUser(uid);
          await auth.updateUser(uid, { displayName, email, photoURL });
        } catch {
          await auth.createUser({ uid, email, displayName, photoURL });
          isNewUser = true;
        }

        const userDocRef = db.collection("users").doc(uid);
        const existingDoc = await userDocRef.get();
        const existingData = existingDoc.exists ? existingDoc.data() : null;

        if (!existingDoc.exists || !existingData?.termsAgreed) {
          isNewUser = true;
          if (!existingDoc.exists) {
            await userDocRef.set({
              uid,
              email,
              displayName,
              photoURL,
              role,
              termsAgreed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } else {
          await userDocRef.update({
            displayName,
            email,
            photoURL,
            updatedAt: new Date().toISOString(),
          });
        }

        await auth.setCustomUserClaims(uid, { role });
        customToken = await auth.createCustomToken(uid, { role });
      } else {
        customToken = `mock_kakao_token_${Date.now()}_${uid}`;
        const cookiesHeader = request.headers.get("cookie") || "";
        if (!cookiesHeader.includes("qollab_terms_agreed=true")) {
          isNewUser = true;
        }
      }
    } catch {
      customToken = `mock_kakao_token_${Date.now()}_${uid}`;
      const cookiesHeader = request.headers.get("cookie") || "";
      if (!cookiesHeader.includes("qollab_terms_agreed=true")) {
        isNewUser = true;
      }
    }

    const redirectTarget = new URL(isNewUser ? "/onboarding" : "/auth/login", requestUrl.origin);
    if (customToken) redirectTarget.searchParams.set("customToken", customToken);
    redirectTarget.searchParams.set("role", role);
    if (isNewUser) redirectTarget.searchParams.set("isNewUser", "true");

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set("qollab_user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kakao OAuth Exception";
    const errorUrl = new URL("/auth/login", requestUrl.origin);
    errorUrl.searchParams.set("error", message);
    return NextResponse.redirect(errorUrl);
  }
}
