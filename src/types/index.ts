export const ITEM_TRIGGERS = [
  "need",
  "upgrade",
  "like",
  "self_reward",
  "influenced",
  "discount",
  "investment",
] as const;

export type ItemTrigger = (typeof ITEM_TRIGGERS)[number];

export type ItemStatus = "waiting" | "ready" | "bought" | "dropped";

export interface Item {
  id: string;
  name: string;
  price: number;
  trigger: ItemTrigger;
  reason?: string;
  imageUrl?: string;
  createdAt: string;
  reviewAt: string;
  status: ItemStatus;
}