import { Timestamp } from "firebase/firestore";

export type UserRole = "consumer" | "owner" | "admin";

export interface UserDocument {
  uid: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  createdAt: Timestamp | Date | string;
}

export type StoreStatus = "pending" | "active" | "suspended" | "rejected";

export interface StoreDocument {
  storeId: string;
  owner_id: string;
  name: string;
  category: string;
  subcategory: string;
  region: string;
  avg_ticket: number; // KRW integer
  capacity: number;
  idle_slots: string; // e.g. "월~금 14:00~17:00"
  status: StoreStatus;
  reject_reason?: string;
  lat: number;
  lng: number;
  story_label: string; // Goodsixty-style Local merchant story label
  createdAt: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export type PackageStatus = "draft" | "inviting" | "open" | "closed" | "soldout";

export interface PackageDocument {
  packageId: string;
  title: string;
  region: string;
  headcount: number;
  list_total: number; // KRW integer
  sale_price: number; // KRW integer
  fee_rate: number; // e.g. 0.10 (10%)
  stock: number;
  valid_from: string; // YYYY-MM-DD
  valid_to: string; // YYYY-MM-DD
  status: PackageStatus;
  createdAt: Timestamp | Date | string;
}

export type SlotRole = "anchor" | "rider";
export type SlotStatus = "invited" | "accepted" | "declined";

export interface PackageSlotDocument {
  slotId: string;
  package_id: string;
  slot_role: SlotRole;
  store_id: string;
  list_value: number; // KRW integer
  contribution: number; // ratio (0.0 ~ 1.0)
  settle_amount: number; // KRW integer
  status: SlotStatus;
  createdAt?: Timestamp | Date | string;
}

export type OrderStatus = "pending_payment" | "paid" | "completed" | "cancelled";

export interface OrderDocument {
  orderId: string;
  order_no: string;
  package_id: string;
  buyer_name: string;
  buyer_phone: string;
  qty: number;
  unit_price: number; // KRW integer
  total_amount: number; // KRW integer
  status: OrderStatus;
  createdAt: Timestamp | Date | string;
}

export type PaymentStatus = "pending" | "confirmed" | "failed" | "refunded";

export interface PaymentDocument {
  paymentId: string;
  order_id: string;
  provider: "portone" | "toss";
  easy_payment_method?: string; // e.g. "kakaopay", "naverpay", "card"
  amount: number; // KRW integer
  status: PaymentStatus;
  raw?: Record<string, unknown>;
  createdAt: Timestamp | Date | string;
}

export type VoucherStatus = "issued" | "used" | "expired" | "cancelled";

export interface VoucherDocument {
  voucherId: string;
  code: string;
  order_id: string;
  package_slot_id: string;
  store_id: string;
  settle_amount: number; // SNAPSHOT: KRW integer
  status: VoucherStatus;
  valid_until: string; // YYYY-MM-DD
  used_at?: Timestamp | Date | string;
  used_by?: string;
  createdAt: Timestamp | Date | string;
}

export type SettlementStatus = "draft" | "notified" | "agreed" | "paid" | "disputed";

export interface SettlementDocument {
  settlementId: string;
  store_id: string;
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
  voucher_count: number;
  gross_amount: number; // KRW integer
  net_amount: number; // KRW integer
  status: SettlementStatus;
  createdAt: Timestamp | Date | string;
}
