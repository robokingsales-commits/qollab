/**
 * Qollab Cart (장바구니) & Order Management Service
 */

export interface CartComboStoreItem {
  id: string;
  storeName: string;
  category: string;
  itemName: string;
  originalPrice: number;
  minPrice: number;
  discountCapacity: number;
  appliedDiscount: number;
  finalPrice: number;
  imageUrl?: string;
  address?: string;
}

export interface CartComboItem {
  id: string;
  title: string;
  locationName: string;
  createdAt: number;
  itemCount: number;
  discountRatePercent: number; // 0, 60, 85, 100
  rateLabel: string;
  stores: CartComboStoreItem[];
  totalOriginalPrice: number;
  totalDiscountAmount: number;
  totalFinalPrice: number;
}

const CART_STORAGE_KEY = "qollab_cart_items_v1";

type CartListener = (cart: CartComboItem[]) => void;
const listeners: Set<CartListener> = new Set();

export function getCart(): CartComboItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load cart items:", e);
    return [];
  }
}

function saveCart(cart: CartComboItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    listeners.forEach((listener) => listener(cart));
  } catch (e) {
    console.warn("Failed to save cart items:", e);
  }
}

export function addToCart(combo: Omit<CartComboItem, "id" | "createdAt">): CartComboItem {
  const currentCart = getCart();
  const newItem: CartComboItem = {
    ...combo,
    id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
  };

  const updatedCart = [newItem, ...currentCart];
  saveCart(updatedCart);
  return newItem;
}

export function removeFromCart(cartItemId: string): void {
  const currentCart = getCart();
  const updatedCart = currentCart.filter((item) => item.id !== cartItemId);
  saveCart(updatedCart);
}

export function clearCart(): void {
  saveCart([]);
}

export function subscribeCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
