import type { Item } from "@/types";

interface ReadyItemCardProps {
  item: Item;
}

export default function ReadyItemCard({ item }: ReadyItemCardProps) {
  return (
    <div className="bg-gray-100 p-4">
      <h3>{item.name}</h3>
      <p>{item.price}</p>

      <button className="bg-zinc-900 text-white px-3 py-1.5 mt-2 rounded-md">
        Check in
      </button>
    </div>
  );
}
