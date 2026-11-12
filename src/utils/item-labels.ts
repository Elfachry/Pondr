import type { ItemTrigger } from "@/types";

export const TRIGGER_LABELS: Record<ItemTrigger, string> = {
  need: "I need it",
  upgrade: "I want to upgrade",
  like: "I simply like it",
  self_reward: "I want to reward myself",
  influenced: "Someone influenced me",
  discount: "It's on sale",
  investment: "It's an investment",
};
