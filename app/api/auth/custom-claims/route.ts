import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

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

    if (idToken) {
      const decoded = await adminAuth.verifyIdToken(idToken);
      if (decoded.uid !== uid) {
        return NextResponse.json({ error: "Unauthorized UID mismatch" }, { status: 403 });
      }
    }

    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true, uid, role });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
