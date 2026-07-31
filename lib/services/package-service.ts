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
import { PackageDocument, PackageSlotDocument, StoreDocument, PackageStatus, SlotStatus } from "@/lib/types/schema";
import { calculateVIMSCTScore } from "@/lib/domain/vim-matching";
import { calculateSlotAmounts } from "@/lib/utils";

const PACKAGES_COLLECTION = "packages";
const SLOTS_COLLECTION = "package_slots";

export interface CreatePackageInput {
  title: string;
  region: string;
  headcount: number;
  list_total: number;
  sale_price: number;
  fee_rate: number;
  stock: number;
  valid_from: string;
  valid_to: string;
  slots: {
    store_id: string;
    slot_role: "anchor" | "rider";
    list_value: number;
    contribution: number; // ratio (0.0 ~ 1.0)
  }[];
}

export async function createPackageWithSlots(input: CreatePackageInput): Promise<string> {
  const packageRef = doc(collection(db, PACKAGES_COLLECTION));
  const packageId = packageRef.id;

  const salePriceRounded = Math.round(input.sale_price);
  const listTotalRounded = Math.round(input.list_total);

  // Compute settle amounts per slot using utility (Anchor gets remainder)
  const ratios = input.slots.map((s) => s.contribution);
  const settleAmounts = calculateSlotAmounts(salePriceRounded, ratios);

  const newPackage: PackageDocument = {
    packageId,
    title: input.title,
    region: input.region,
    headcount: input.headcount,
    list_total: listTotalRounded,
    sale_price: salePriceRounded,
    fee_rate: input.fee_rate,
    stock: input.stock,
    valid_from: input.valid_from,
    valid_to: input.valid_to,
    status: "inviting",
    createdAt: new Date().toISOString(),
  };

  await setDoc(packageRef, newPackage);

  // Create slot documents
  for (let i = 0; i < input.slots.length; i++) {
    const slotInput = input.slots[i];
    const slotRef = doc(collection(db, SLOTS_COLLECTION));
    const newSlot: PackageSlotDocument = {
      slotId: slotRef.id,
      package_id: packageId,
      slot_role: slotInput.slot_role,
      store_id: slotInput.store_id,
      list_value: Math.round(slotInput.list_value),
      contribution: slotInput.contribution,
      settle_amount: settleAmounts[i],
      status: slotInput.slot_role === "anchor" ? "accepted" : "invited",
      createdAt: new Date().toISOString(),
    };
    await setDoc(slotRef, newSlot);
  }

  return packageId;
}

export async function getPackageById(packageId: string): Promise<{
  packageData: PackageDocument;
  slots: PackageSlotDocument[];
} | null> {
  const pkgRef = doc(db, PACKAGES_COLLECTION, packageId);
  const snap = await getDoc(pkgRef);
  if (!snap.exists()) return null;

  const qSlots = query(
    collection(db, SLOTS_COLLECTION),
    where("package_id", "==", packageId)
  );
  const slotsSnap = await getDocs(qSlots);
  const slots = slotsSnap.docs.map((d) => d.data() as PackageSlotDocument);

  return {
    packageData: snap.data() as PackageDocument,
    slots,
  };
}

export async function listOpenPackages(region?: string): Promise<PackageDocument[]> {
  let q = query(
    collection(db, PACKAGES_COLLECTION),
    where("status", "==", "open")
  );
  if (region) {
    q = query(q, where("region", "==", region));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PackageDocument);
}

export async function updatePackageStatus(packageId: string, status: PackageStatus): Promise<void> {
  const pkgRef = doc(db, PACKAGES_COLLECTION, packageId);
  await updateDoc(pkgRef, { status });
}

export async function updateSlotStatus(slotId: string, status: SlotStatus): Promise<void> {
  const slotRef = doc(db, SLOTS_COLLECTION, slotId);
  await updateDoc(slotRef, { status });
}

/**
 * V.I.M 6-Axis Rider Recommendation Logic
 */
export function recommendRiderStoresForAnchor(
  anchorStore: StoreDocument,
  candidateStores: StoreDocument[]
): { store: StoreDocument; vimScore: number }[] {
  return candidateStores
    .filter((s) => s.storeId !== anchorStore.storeId && s.status === "active")
    .map((store) => {
      // Calculate spatial proximity (Euclidean distance approximation)
      const latDiff = Math.abs(anchorStore.lat - store.lat);
      const lngDiff = Math.abs(anchorStore.lng - store.lng);
      const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      const spatialScore = Math.max(0.1, 1.0 - dist * 20);

      // Calculate category cohesion
      const isComplementaryCategory = anchorStore.category !== store.category;
      const categoryScore = isComplementaryCategory ? 0.95 : 0.6;

      const vimScore = calculateVIMSCTScore({
        v: 0.8,
        i: 0.85,
        m: 0.75,
        c: categoryScore,
        s: spatialScore,
        t: 0.9,
      });

      return { store, vimScore };
    })
    .sort((a, b) => b.vimScore - a.vimScore);
}
