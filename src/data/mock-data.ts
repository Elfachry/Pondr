import type { Item } from "@/types";

export const MOCK_ITEMS: Item[] = [
  {
    id: "item-1",
    name: "Mechanical Keyboard",
    price: 850000,
    trigger: "upgrade",
    reason: "Thinking about upgrading my setup.",
    createdAt: "2026-11-01T10:00:00.000Z",
    reviewAt: "2026-11-15T10:00:00.000Z",
    status: "waiting",
  },
  {
    id: "item-2",
    name: "Wireless Earbuds",
    price: 450000,
    trigger: "discount",
    reason: "Saw a really good discount.",
    createdAt: "2026-11-02T10:00:00.000Z",
    reviewAt: "2026-11-09T10:00:00.000Z",
    status: "ready",
  },
  {
    id: "item-3",
    name: "Running Shoes",
    price: 750000,
    trigger: "need",
    reason: "Want to start running.",
    createdAt: "2026-11-03T10:00:00.000Z",
    reviewAt: "2026-11-17T10:00:00.000Z",
    status: "waiting",
  },
  {
    id: "item-4",
    name: "The Pragmatic Programmer",
    price: 180000,
    trigger: "self_reward",
    reason: "Recommended by a friend.",
    createdAt: "2026-10-20T10:00:00.000Z",
    reviewAt: "2026-11-03T10:00:00.000Z",
    status: "bought",
  },
];
