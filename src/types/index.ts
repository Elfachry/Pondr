export type ItemStatus = "waiting" | "ready" | "bought" | "dropped";

export interface Item {
  id: string;
  name: string;
  price: number;
  note?: string;
  trigger?: string;
  createdAt: string;
  reviewAt: string;
  status: ItemStatus;
}
