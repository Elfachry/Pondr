import type { Item } from "@/types";

interface WaitingItemCardProps {
  item: Item;
}

export default function WaitingItemCard({ item }: WaitingItemCardProps) {
  return (
    <div className="bg-gray-100 p-4">
      <h3>{item.name}</h3>
      <p>{item.price}</p>
    </div>
  );
}
