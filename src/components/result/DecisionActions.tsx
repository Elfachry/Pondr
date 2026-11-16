"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CONFIG } from "@/lib/pondr-config";
import { getReviewDate, isValidWaitingDays } from "@/lib/waiting-days";
import type { ItemStatus } from "@/types";

interface DecisionActionsProps {
  itemId: string;
}

export default function DecisionActions({ itemId }: DecisionActionsProps) {
  const router = useRouter();
  const [askingDays, setAskingDays] = useState(false);
  const [days, setDays] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const parsedDays = Number(days);
  const daysValid = days.trim() !== "" && isValidWaitingDays(parsedDays);

  async function save(update: { status: ItemStatus; review_at?: string }) {
    if (isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("items")
        .update(update)
        .eq("id", itemId)
        .select("id");

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Item was not updated.");

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to save decision:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSaving(false);
    }
  }

  function handleKeepWaiting() {
    if (!daysValid) return;
    save({
      status: "waiting",
      review_at: getReviewDate(parsedDays).toISOString(),
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save({ status: "bought" })}
          className="rounded-xl border border-gray-300 bg-gray-200 px-3 py-3 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-300 disabled:opacity-40"
        >
          Buy item
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => setAskingDays(true)}
          className="rounded-xl border border-gray-300 bg-gray-200 px-3 py-3 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-300 disabled:opacity-40"
        >
          Keep waiting
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => save({ status: "dropped" })}
          className="rounded-xl border border-gray-300 bg-gray-200 px-3 py-3 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-300 disabled:opacity-40"
        >
          Drop
        </button>
      </div>

      {askingDays && (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label
            htmlFor="waiting-days"
            className="block text-sm font-medium text-gray-900"
          >
            How many more days do you want to wait?
          </label>

          <div className="flex items-center gap-2">
            <input
              id="waiting-days"
              type="number"
              inputMode="numeric"
              min={CONFIG.waitingDays.min}
              max={CONFIG.waitingDays.max}
              step={1}
              autoFocus
              value={days}
              onChange={(e) => setDays(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleKeepWaiting()}
              placeholder="e.g. 7"
              className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>

          {days.trim() !== "" && !daysValid && (
            <p className="text-xs text-red-600">
              Enter a whole number from {CONFIG.waitingDays.min} to{" "}
              {CONFIG.waitingDays.max}.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleKeepWaiting}
              disabled={!daysValid || isSaving}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => {
                setAskingDays(false);
                setDays("");
              }}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
