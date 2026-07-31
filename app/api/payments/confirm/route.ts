import { NextResponse } from "next/server";
import { verifyPaymentWithPortone } from "@/lib/adapters/payment-adapter";
import { adminDb } from "@/lib/firebase/admin";
import { sendVoucherIssuedAlimtalk } from "@/lib/services/alimtalk-service";
import { VoucherDocument } from "@/lib/types/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, orderId, amount, slots } = body;

    if (!paymentId || !orderId || !amount) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const expectedAmount = Math.round(Number(amount));

    const verifyResult = await verifyPaymentWithPortone(paymentId, expectedAmount);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error || "Payment verification failed" },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    await orderRef.update({
      status: "paid",
      updatedAt: new Date().toISOString(),
    });

    const paymentRef = adminDb.collection("payments").doc(paymentId);
    await paymentRef.set({
      paymentId,
      order_id: orderId,
      provider: "portone",
      amount: expectedAmount,
      status: "confirmed",
      raw: verifyResult.raw || {},
      createdAt: new Date().toISOString(),
    });

    const issuedVouchers: VoucherDocument[] = [];
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const slotList = slots || [
      { package_slot_id: "slot-demo-1", store_id: "store-demo-1", settle_amount: 19600 },
      { package_slot_id: "slot-demo-2", store_id: "store-demo-2", settle_amount: 29400 },
    ];

    for (const slot of slotList) {
      const voucherRef = adminDb.collection("vouchers").doc();
      const code = `VOUCHER-${Math.floor(100000 + Math.random() * 900000)}`;

      const voucherDoc: VoucherDocument = {
        voucherId: voucherRef.id,
        code,
        order_id: orderId,
        package_slot_id: slot.package_slot_id,
        store_id: slot.store_id,
        settle_amount: Math.round(slot.settle_amount), // SNAPSHOT SAVED
        status: "issued",
        valid_until: validUntil,
        createdAt: new Date().toISOString(),
      };

      await voucherRef.set(voucherDoc);
      issuedVouchers.push(voucherDoc);

      await sendVoucherIssuedAlimtalk("010-0000-0000", code, "성수 루프탑 로스터리", validUntil);
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentId,
      vouchers: issuedVouchers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
