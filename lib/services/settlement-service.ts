import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { SettlementDocument, VoucherDocument, SettlementStatus } from "@/lib/types/schema";
import { sendWeeklySettlementApprovalAlimtalk } from "@/lib/services/alimtalk-service";

const SETTLEMENTS_COLLECTION = "settlements";
const VOUCHERS_COLLECTION = "vouchers";

export async function generateStoreSettlement(
  storeId: string,
  periodStart: string,
  periodEnd: string,
  platformFeeRate: number = 0.1
): Promise<string> {
  const qVouchers = query(
    collection(db, VOUCHERS_COLLECTION),
    where("store_id", "==", storeId),
    where("status", "==", "used")
  );

  const snap = await getDocs(qVouchers);
  const usedVouchers = snap.docs.map((d) => d.data() as VoucherDocument);

  let grossAmount = 0;
  for (const v of usedVouchers) {
    grossAmount += Math.round(v.settle_amount);
  }

  const voucherCount = usedVouchers.length;
  const netAmount = Math.round(grossAmount * (1 - platformFeeRate));

  const settlementRef = doc(collection(db, SETTLEMENTS_COLLECTION));
  const settlementId = settlementRef.id;

  const newSettlement: SettlementDocument = {
    settlementId,
    store_id: storeId,
    period_start: periodStart,
    period_end: periodEnd,
    voucher_count: voucherCount,
    gross_amount: grossAmount,
    net_amount: netAmount,
    status: "notified",
    createdAt: new Date().toISOString(),
  };

  await setDoc(settlementRef, newSettlement);

  await sendWeeklySettlementApprovalAlimtalk(
    "010-0000-0000",
    "성수 루프탑 로스터리 카페",
    netAmount,
    `${periodStart} ~ ${periodEnd}`
  );

  return settlementId;
}

export async function getSettlementsByStore(storeId: string): Promise<SettlementDocument[]> {
  const q = query(
    collection(db, SETTLEMENTS_COLLECTION),
    where("store_id", "==", storeId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SettlementDocument);
}

export async function listAllSettlements(): Promise<SettlementDocument[]> {
  const q = query(collection(db, SETTLEMENTS_COLLECTION));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SettlementDocument);
}

export async function updateSettlementStatus(
  settlementId: string,
  status: SettlementStatus
): Promise<void> {
  const ref = doc(db, SETTLEMENTS_COLLECTION, settlementId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date().toISOString(),
  });
}
