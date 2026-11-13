"use client";

import { useState } from "react";
import { ITEM_TRIGGERS, type ItemTrigger } from "@/types";

const TRIGGER_LABELS: Record<ItemTrigger, string> = {
  need: "I need it",
  upgrade: "I want to upgrade",
  like: "I simply like it",
  self_reward: "I want to reward myself",
  influenced: "Someone influenced me",
  discount: "It's on sale",
  investment: "It's an investment",
};

export default function AddPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [trigger, setTrigger] = useState<ItemTrigger | "">("");
  const [reason, setReason] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!trigger) return;

    const newItem = {
      name,
      price: Number(price),
      trigger,
      reason,
    };

    console.log("New item:", newItem);
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400";

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <div className="mx-auto max-w-xl px-5 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Add an item
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Before buying, let's understand why you want it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Item name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              What do you want to buy?
            </label>

            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New headphones"
              className={inputClass}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              How much does it cost?
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                Rp
              </span>
              <input
                id="price"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className={`${inputClass} pl-12`}
                required
              />
            </div>
          </div>

          {/* Trigger */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-800">
              Why do you want it?
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ITEM_TRIGGERS.map((itemTrigger) => {
                const selected = trigger === itemTrigger;

                return (
                  <label
                    key={itemTrigger}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                      selected
                        ? "border-gray-900 bg-gray-50 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="trigger"
                      value={itemTrigger}
                      checked={selected}
                      onChange={() => setTrigger(itemTrigger)}
                      required
                      className="accent-gray-900"
                    />

                    <span className={selected ? "font-medium" : ""}>
                      {TRIGGER_LABELS[itemTrigger]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Anything else?
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </label>

            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell yourself why this item matters..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-[0.99]"
          >
            Add to wishlist
          </button>
        </form>
      </div>
    </main>
  );
}
