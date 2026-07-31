import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money values strictly as rounded KRW integers.
 */
export function formatKRW(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Helper to split residual remainder to anchor slot
 */
export function calculateSlotAmounts(
  totalSalePrice: number,
  ratios: number[]
): number[] {
  const totalRounded = Math.round(totalSalePrice);
  let allocated = 0;
  const amounts: number[] = [];

  for (let i = 0; i < ratios.length; i++) {
    if (i === 0) {
      // Anchor slot calculation reserved for final remainder adjustment
      amounts.push(0);
    } else {
      const share = Math.round(totalRounded * ratios[i]);
      amounts.push(share);
      allocated += share;
    }
  }

  // Remainder residuals belong strictly to the anchor slot (index 0)
  amounts[0] = Math.max(0, totalRounded - allocated);
  return amounts;
}
