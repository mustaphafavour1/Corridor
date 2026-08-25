import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Currency symbols for the currencies CorriDoor moves. */
export const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  MXN: "MX$",
  PHP: "₱",
  INR: "₹",
  MAD: "DH",
};

/** Full amount, grouped, 2dp — for detail/receipt rows. */
export function formatMoney(amount: number, currency = "USD", dp = 2) {
  const sym = CURRENCY_SYMBOL[currency] ?? "";
  return `${sym}${amount.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
}

/** Compact money for KPI tiles: $32.5M / £1.2k. */
export function formatCompact(amount: number, currency = "USD") {
  const sym = CURRENCY_SYMBOL[currency] ?? "";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `${sym}${(amount / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sym}${(amount / 1_000).toFixed(1)}k`;
  return `${sym}${Math.round(amount).toLocaleString("en-US")}`;
}

/** Compact plain number: 32.5k / 1.5M. */
export function formatNum(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

export function formatPct(n: number, dp = 1) {
  return `${n.toFixed(dp)}%`;
}

/** 19 Jan 2026 */
export function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** 19 Jan 2026, 13:05 */
export function formatDateTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return `${formatDate(date)}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function initials(first?: string, last?: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

/** Relative "3d ago" style age from an ISO date. */
export function ageFrom(iso: string, now = new Date()) {
  const then = new Date(iso).getTime();
  const days = Math.floor((now.getTime() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1mo" : `${months}mo`;
}

/** Deterministic pseudo-random in [0,1) from a string seed (stable seeds). */
export function seededRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}
