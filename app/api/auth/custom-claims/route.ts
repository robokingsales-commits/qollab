import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, role, idToken } = body;

    if (!uid || !role || !["consumer", "owner", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid payload. Required: uid, role ('consumer'|'owner'|'admin')" },
        { status: 400 }
      );
    }

    const auth = await getAdminAuth();

    if (idToken && auth) {
      try {
        const decoded = await auth.verifyIdToken(idToken);
        if (decoded.uid !== uid) {
          return NextResponse.json({ error: "Unauthorized UID mismatch" }, { status: 403 });
        }
      } catch (e) {
        console.warn("[Custom Claims] ID token verification skipped", e);
      }
    }

    try {
      if (auth) await auth.setCustomUserClaims(uid, { role });
    } catch (e) {
      console.warn("[Custom Claims] Gracefully handled missing Auth user", uid, e);
    }

    return NextResponse.json({ success: true, uid, role });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
