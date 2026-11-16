"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/types";
import { TRIGGER_LABELS } from "@/utils/item-labels";
import { formatDaysLeft, getWaitProgress } from "@/lib/waiting-days";

interface WaitingItemCardProps {
  item: Item;
  onOpen: () => void;
}

export default function WaitingItemCard({
  item,
  onOpen,
}: WaitingItemCardProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const wait = now === null ? null : getWaitProgress(item, now);

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View details for ${item.name}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {TRIGGER_LABELS[item.trigger]}
            </span>

            <span className="text-xs text-gray-400">
              {wait === null ? " " : formatDaysLeft(wait.daysLeft)}
            </span>
          </div>
        </div>

        <p className="shrink-0 text-sm font-medium text-gray-700">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Waiting progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(wait?.progress ?? 0)}
          className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        >
          <div
            className="h-full rounded-full bg-zinc-900"
            style={{ width: `${wait?.progress ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}