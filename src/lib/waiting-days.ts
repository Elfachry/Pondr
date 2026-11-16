import { CONFIG } from "@/lib/pondr-config";
import type { Item } from "@/types";

export function getDefaultWaitingDays(price: number): number {
  const { tiers, aboveTiersDays } = CONFIG.waitingDays;
  const tier = tiers.find((t) => price <= t.maxPrice);
  return tier ? tier.days : aboveTiersDays;
}

export function isValidWaitingDays(days: number): boolean {
  const { min, max } = CONFIG.waitingDays;
  return Number.isInteger(days) && days >= min && days <= max;
}

export function getReviewDate(days: number, from: Date = new Date()): Date {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function getWaitProgress(
  item: Pick<Item, "createdAt" | "reviewAt">,
  now: number,
) {
  const createdMs = new Date(item.createdAt).getTime();
  const reviewMs = new Date(item.reviewAt).getTime();
  const totalMs = Math.max(1, reviewMs - createdMs);

  return {
    daysLeft: Math.max(0, Math.ceil((reviewMs - now) / DAY_MS)),
    progress: Math.min(100, Math.max(0, ((now - createdMs) / totalMs) * 100)),
  };
}

export function formatDaysLeft(daysLeft: number): string {
  if (daysLeft === 0) return "Check-in today";
  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
}