"use client";

import { useState } from "react";
import type { Item } from "@/types";
import ReadyItemCard from "@/components/items/ReadyItemCard";
import WaitingItemCard from "@/components/items/WaitingItemCard";
import ItemDetailModal from "@/components/items/ItemDetailModal";

interface ItemsBoardProps {
  initialItems: Item[];
}

export default function ItemsBoard({ initialItems }: ItemsBoardProps) {
  // TODO (backend): replace local state with data from the database.
  const [items, setItems] = useState<Item[]>(initialItems);
  const [open, setOpen] = useState<{ id: string; now: number } | null>(null);

  const readyItems = items.filter((item) => item.status === "ready");
  const waitingItems = items.filter((item) => item.status === "waiting");
  const openItem = open ? items.find((item) => item.id === open.id) : undefined;

  function handleOpen(id: string) {
    setOpen({ id, now: Date.now() });
  }

  function handleSkipWait(id: string) {
    // TODO (backend): persist status "ready" and the new reviewAt.
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "ready", reviewAt: new Date().toISOString() }
          : item,
      ),
    );
    setOpen(null);
  }

  function handleDelete(id: string) {
    // TODO (backend): delete the item.
    setItems((prev) => prev.filter((item) => item.id !== id));
    setOpen(null);
  }

  return (
    <div className="space-y-8">
      {/* Ready to review */}
      {readyItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Ready to review</h2>
            <span className="text-xs text-gray-500">
              {readyItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {readyItems.map((item) => (
              <ReadyItemCard
                key={item.id}
                item={item}
                onOpen={() => handleOpen(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Waiting */}
      {waitingItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Waiting</h2>
            <span className="text-xs text-gray-500">
              {waitingItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {waitingItems.map((item) => (
              <WaitingItemCard
                key={item.id}
                item={item}
                onOpen={() => handleOpen(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {readyItems.length === 0 && waitingItems.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="font-medium text-gray-900">Nothing here yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Add something to your wishlist and take your time deciding.
          </p>
        </div>
      )}

      {open && openItem && (
        <ItemDetailModal
          key={openItem.id}
          item={openItem}
          now={open.now}
          onClose={() => setOpen(null)}
          onSkipWait={handleSkipWait}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}