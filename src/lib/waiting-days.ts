import { CONFIG } from "@/lib/pondr-config";

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