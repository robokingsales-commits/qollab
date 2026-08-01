import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "consumer";
  const role = ["owner", "admin"].includes(state) ? state : "consumer";

  const clientId = process.env.NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Missing authorization code or Naver credentials")}`, request.url)
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
    const uid = `naver:${naverProfile.id}`;
    const email = naverProfile.email || `${naverProfile.id}@naver.qollab.com`;
    const displayName = naverProfile.name || naverProfile.nickname || "네이버 사용자";

    try {
      await adminAuth.getUser(uid);
      await adminAuth.updateUser(uid, { displayName, email });
    } catch {
      await adminAuth.createUser({ uid, email, displayName });
    }

    await adminAuth.setCustomUserClaims(uid, { role });
    const customToken = await adminAuth.createCustomToken(uid, { role });

    const redirectTarget = new URL("/auth/login", request.url);
    redirectTarget.searchParams.set("customToken", customToken);
    redirectTarget.searchParams.set("role", role);

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
