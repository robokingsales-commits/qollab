import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "consumer";
  const role = ["owner", "admin"].includes(state) ? state : "consumer";

  const clientId = process.env.KAKAO_CLIENT_ID || process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = process.env.KAKAO_REDIRECT_URI || process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!code || !clientId || !redirectUri) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Missing authorization code or Kakao client configuration")}`, request.url)
    );
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
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
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, request.url)
      );
    }

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok || !userData.id) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent("Failed to fetch Kakao user profile")}`, request.url)
      );
    }

    const uid = `kakao:${userData.id}`;
    const email = userData.kakao_account?.email || `${userData.id}@kakao.qollab.com`;
    const displayName = userData.kakao_account?.profile?.nickname || "카카오 사용자";
    const photoURL = userData.kakao_account?.profile?.profile_image_url || "";

    let isNewUser = false;
    try {
      await adminAuth.getUser(uid);
      await adminAuth.updateUser(uid, { displayName, email, photoURL });
    } catch {
      await adminAuth.createUser({ uid, email, displayName, photoURL });
      isNewUser = true;
    }

    // Upsert Firestore User Profile Document
    const userDocRef = adminDb.collection("users").doc(uid);
    const existingDoc = await userDocRef.get();

    if (!existingDoc.exists) {
      isNewUser = true;
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
    } else {
      await userDocRef.update({
        displayName,
        email,
        photoURL,
        updatedAt: new Date().toISOString(),
      });
    }

    await adminAuth.setCustomUserClaims(uid, { role });
    const customToken = await adminAuth.createCustomToken(uid, { role });

    const redirectTarget = new URL(isNewUser ? "/onboarding" : "/auth/login", request.url);
    redirectTarget.searchParams.set("customToken", customToken);
    redirectTarget.searchParams.set("role", role);
    if (isNewUser) redirectTarget.searchParams.set("isNewUser", "true");

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set("qollab_user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kakao OAuth Exception";
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
