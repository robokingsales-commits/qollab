import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { StoreDocument, StoreStatus } from "@/lib/types/schema";

const STORES_COLLECTION = "stores";

export async function createStore(
  data: Omit<StoreDocument, "storeId" | "createdAt" | "status">
): Promise<string> {
  const storeRef = doc(collection(db, STORES_COLLECTION));
  const storeId = storeRef.id;

  const newStore: StoreDocument = {
    ...data,
    storeId,
    status: "pending",
    avg_ticket: Math.round(data.avg_ticket),
    createdAt: new Date().toISOString(),
  };

  await setDoc(storeRef, newStore);
  return storeId;
}

export async function getStoreById(storeId: string): Promise<StoreDocument | null> {
  const storeRef = doc(db, STORES_COLLECTION, storeId);
  const snap = await getDoc(storeRef);
  if (!snap.exists()) return null;
  return snap.data() as StoreDocument;
}

export async function getStoresByOwner(ownerId: string): Promise<StoreDocument[]> {
  const q = query(
    collection(db, STORES_COLLECTION),
    where("owner_id", "==", ownerId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as StoreDocument);
}

export async function listPendingStores(): Promise<StoreDocument[]> {
  const q = query(
    collection(db, STORES_COLLECTION),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as StoreDocument);
}

export async function updateStoreStatus(
  storeId: string,
  status: StoreStatus,
  rejectReason?: string
): Promise<void> {
  const storeRef = doc(db, STORES_COLLECTION, storeId);
  await updateDoc(storeRef, {
    status,
    ...(rejectReason ? { reject_reason: rejectReason } : {}),
    updatedAt: new Date().toISOString(),
  });
}
