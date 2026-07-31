import { NextResponse } from "next/server";
import {
  listAllSettlements,
  generateStoreSettlement,
  updateSettlementStatus,
} from "@/lib/services/settlement-service";

export async function GET() {
  try {
    const settlements = await listAllSettlements();
    return NextResponse.json({ settlements });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to list settlements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, periodStart, periodEnd } = body;

    if (!storeId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const settlementId = await generateStoreSettlement(storeId, periodStart, periodEnd);
    return NextResponse.json({ success: true, settlementId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate settlement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { settlementId, status } = body;

    if (!settlementId || !status || !["draft", "notified", "agreed", "paid", "disputed"].includes(status)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    await updateSettlementStatus(settlementId, status);
    return NextResponse.json({ success: true, settlementId, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update settlement status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
