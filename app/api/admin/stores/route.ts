import { NextResponse } from "next/server";
import { listPendingStores, updateStoreStatus } from "@/lib/services/store-service";

export async function GET() {
  try {
    const stores = await listPendingStores();
    return NextResponse.json({ stores });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to list pending stores";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { storeId, status, rejectReason } = body;

    if (!storeId || !status || !["active", "suspended", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    await updateStoreStatus(storeId, status, rejectReason);
    return NextResponse.json({ success: true, storeId, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update store status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
