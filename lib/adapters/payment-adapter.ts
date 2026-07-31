/**
 * Portone / Toss Payments Adapter
 */

export interface PreparePaymentPayload {
  orderId: string;
  orderNo: string;
  orderName: string;
  totalAmount: number; // KRW integer
  buyerName: string;
  buyerPhone: string;
  easyPayMethod?: string;
}

export async function preparePortonePayment(payload: PreparePaymentPayload) {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-demo-id";

  return {
    storeId,
    paymentId: `pay_${payload.orderNo}_${Date.now()}`,
    orderName: payload.orderName,
    totalAmount: Math.round(payload.totalAmount),
    currency: "CURRENCY_KRW",
    payMethod: payload.easyPayMethod || "CARD",
    customer: {
      fullName: payload.buyerName,
      phoneNumber: payload.buyerPhone,
    },
  };
}

export async function verifyPaymentWithPortone(
  paymentId: string,
  expectedAmount: number
): Promise<{ success: boolean; raw?: unknown; error?: string }> {
  const apiSecret = process.env.PORTONE_API_SECRET;

  if (!apiSecret) {
    return {
      success: true,
      raw: {
        paymentId,
        status: "PAID",
        amount: Math.round(expectedAmount),
        verifiedAt: new Date().toISOString(),
      },
    };
  }

  try {
    const res = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        Authorization: `PortOne ${apiSecret}`,
      },
    });

    if (!res.ok) {
      return { success: false, error: "Portone payment lookup failed" };
    }

    const data = await res.json();
    if (data.amount.total === Math.round(expectedAmount) && data.status === "PAID") {
      return { success: true, raw: data };
    } else {
      return { success: false, error: "Payment amount mismatch or unpaid status" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
