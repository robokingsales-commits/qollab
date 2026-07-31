import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { voucherId, code, usedByStoreId } = body;

    if (!voucherId && !code) {
      return NextResponse.json({ error: "Required: voucherId or code" }, { status: 400 });
    }

    const result = await adminDb.runTransaction(async (transaction) => {
      let voucherRef;
      if (voucherId) {
        voucherRef = adminDb.collection("vouchers").doc(voucherId);
      } else {
        const snap = await transaction.get(
          adminDb.collection("vouchers").where("code", "==", code).limit(1)
        );
        if (snap.empty) {
          throw new Error("Voucher not found for given code");
        }
        voucherRef = snap.docs[0].ref;
      }

      const voucherDoc = await transaction.get(voucherRef);
      if (!voucherDoc.exists) {
        throw new Error("Voucher document does not exist");
      }

      const data = voucherDoc.data();
      if (data?.status !== "issued") {
        throw new Error(`Voucher cannot be used. Current status: ${data?.status}`);
      }

      const now = new Date().toISOString();
      transaction.update(voucherRef, {
        status: "used",
        used_at: now,
        used_by: usedByStoreId || data?.store_id,
      });

      return {
        voucherId: voucherRef.id,
        code: data?.code,
        settle_amount: data?.settle_amount,
        status: "used",
        used_at: now,
      };
    });

    return NextResponse.json({ success: true, voucher: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Transaction failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
