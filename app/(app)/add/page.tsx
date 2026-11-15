"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { useEffect, useRef, useState } from "react";
import { ITEM_TRIGGERS, type ItemTrigger } from "@/types";
import { TRIGGER_LABELS } from "@/utils/item-labels";
import { CONFIG } from "@/lib/pondr-config";
import {
  getDefaultWaitingDays,
  getReviewDate,
  isValidWaitingDays,
} from "@/lib/waiting-days";

const MAX_IMAGE_MB = 5;
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

export default function AddPage() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [trigger, setTrigger] = useState<ItemTrigger | "">("");
  const [reason, setReason] = useState("");
  const [waitingInput, setWaitingInput] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  // Free the preview URL when leaving the page
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function applyImage(file: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : null;
    setImage(file);
    setPreviewUrl(previewRef.current);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.split(",").includes(file.type)) {
      setImageError("Please choose a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be ${MAX_IMAGE_MB} MB or smaller.`);
      e.target.value = "";
      return;
    }

    setImageError("");
    applyImage(file);
  }

  function removeImage() {
    applyImage(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const priceNumber = Number(price);
  const hasPrice = priceNumber > 0;
  const suggestedDays = getDefaultWaitingDays(hasPrice ? priceNumber : 0);
  const isCustomWait = waitingInput !== "";
  const waitingDays = isCustomWait ? Number(waitingInput) : suggestedDays;
  const waitingDaysInvalid = !isValidWaitingDays(waitingDays);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!trigger || waitingDaysInvalid || isSaving) return;

    setIsSaving(true);
    setSubmitError("");

    try {
      const supabase = createClient();

      // Get the currently Logged-in user
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user){
        throw new Error("You must be logged in to add an item.");
      }

      // insert item ke supabase
      const { error: insertError } = await supabase
        .from("items")
        .insert({
          user_id: user.id,
          name: name.trim(),
          price: priceNumber,
          trigger,
          reason: reason.trim() || null,
          review_at: getReviewDate(waitingDays).toISOString(),
          image_url: null,
        });

        if (insertError) throw insertError;

        // balik ke dashboard
        router.push("/");
        router.refresh();

    } catch (error){
      console.error("Failed to add item: ", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your item."
      );
    } finally {
      setIsSaving(false);
    }

  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400";

  return (
    <main className="min-h-screen pb-28">
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
          {/* Image (optional) */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-800">
              Add a photo
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </p>

            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              onChange={handleImageChange}
              className="sr-only"
            />

            {previewUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected item preview"
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">
                    {image?.name}
                  </p>
                  <div className="mt-1 flex gap-3 text-sm">
                    <label
                      htmlFor="image"
                      className="cursor-pointer text-gray-600 underline hover:text-gray-900"
                    >
                      Change
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-gray-600 underline hover:text-gray-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 transition hover:border-gray-500 hover:text-gray-700"
              >
                <span className="font-medium">Choose a photo</span>
                <span className="text-xs text-gray-400">
                  JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB
                </span>
              </label>
            )}

            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
            )}
          </div>

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

          
          {/* Waiting days */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-800">
              How long will you wait before deciding?
            </p>

            <div
              role="group"
              aria-label="Waiting period"
              className="grid grid-cols-4 gap-2"
            >
              {CONFIG.waitingDays.presets.map((days) => {
                const selected = waitingDays === days;

                return (
                  <button
                    key={days}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setWaitingInput(String(days))}
                    className={`rounded-xl border px-2 py-3 text-center text-sm transition ${
                      selected
                        ? "border-gray-900 bg-gray-50 font-medium text-gray-900"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {days} days
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <label htmlFor="waitingDays" className="text-sm text-gray-600">
                Or choose your own
              </label>

              <div className="relative w-32">
                <input
                  id="waitingDays"
                  type="number"
                  inputMode="numeric"
                  min={CONFIG.waitingDays.min}
                  max={CONFIG.waitingDays.max}
                  step={1}
                  value={waitingInput}
                  onChange={(e) => setWaitingInput(e.target.value)}
                  placeholder={String(suggestedDays)}
                  aria-invalid={waitingDaysInvalid}
                  className={`${inputClass} pr-14`}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  days
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Add to wishlist"}
          </button>

          {submitError && (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}