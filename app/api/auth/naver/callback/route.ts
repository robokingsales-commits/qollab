import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "consumer";
  const role = ["owner", "admin"].includes(state) ? state : "consumer";

  const clientId = process.env.NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(
          `Missing Naver credentials (clientId: ${clientId ? "present" : "missing"}, clientSecret: ${
            clientSecret ? "present" : "missing"
          })`
        )}`,
        request.url
      )
    );
  }

  try {
    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.searchParams.set("grant_type", "authorization_code");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("state", state);

    const tokenRes = await fetch(tokenUrl.toString(), { method: "GET" });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errorMsg = tokenData.error_description || tokenData.error || "Failed to retrieve Naver access token";
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, request.url)
      );
    }

    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok || userData.resultcode !== "00" || !userData.response?.id) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent("Failed to fetch Naver user profile")}`, request.url)
      );
    }

    const naverProfile = userData.response;
    const naverEmail = naverProfile.email || `${naverProfile.id}@naver.qollab.com`;
    const naverName = naverProfile.name || naverProfile.nickname || "Naver User";
    const naverProfileImage = naverProfile.profile_image || "";
    const uid = `naver:${naverProfile.id}`;

    const auth = getAdminAuth();
    const db = getAdminDb();

    let firebaseUser;
    let isNewUser = false;

    try {
      firebaseUser = await auth.getUserByEmail(naverEmail);
      await auth.updateUser(firebaseUser.uid, { displayName: naverName, photoURL: naverProfileImage });
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "auth/user-not-found") {
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
      } else {
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
    }

    // Upsert Firestore User Profile Document
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
    const customToken = await auth.createCustomToken(firebaseUser.uid, { role });

    const redirectTarget = new URL(isNewUser ? "/onboarding" : "/auth/login", request.url);
    redirectTarget.searchParams.set("customToken", customToken);
    redirectTarget.searchParams.set("role", role);
    if (isNewUser) redirectTarget.searchParams.set("isNewUser", "true");

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set("qollab_user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Naver OAuth Exception";
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
