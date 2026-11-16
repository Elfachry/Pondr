"use client";

import Link from "next/link";
import type { Item } from "@/types";
import { TRIGGER_LABELS } from "@/utils/item-labels";

interface ReadyItemCardProps {
  item: Item;
  onOpen: () => void;
}

export default function ReadyItemCard({ item, onOpen }: ReadyItemCardProps) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300">
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
          </div>
        </div>

        <p className="shrink-0 text-sm font-semibold text-gray-900">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
      </div>

      <Link
        href={`/items/${item.id}/check-in`}
        className="relative z-10 mt-4 block w-full rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        Check in
      </Link>
    </div>
  );
}