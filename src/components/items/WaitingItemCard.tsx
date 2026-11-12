"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/types";
import { TRIGGER_LABELS } from "@/utils/item-labels";

interface WaitingItemCardProps {
  item: Item;
}

export default function WaitingItemCard({ item }: WaitingItemCardProps) {
  const [waitingDays, setWaitingDays] = useState<number | null>(null);

  useEffect(() => {
    const days = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(item.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    setWaitingDays(days);
  }, [item.createdAt]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {TRIGGER_LABELS[item.trigger]}
            </span>

            <span className="text-xs text-gray-400">
              {waitingDays === null ? " " : `${waitingDays} days waiting`}
            </span>
          </div>
        </div>

        <p className="shrink-0 text-sm font-medium text-gray-700">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}
