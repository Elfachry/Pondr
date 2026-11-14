"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import type { Item } from "@/types";
import {
  CHECK_IN_QUESTIONS,
  type CheckInQuestionId,
} from "@/data/check-in-questions";

const ADVANCE_DELAY_MS = 250;

interface CheckInFlowProps {
  item: Item;
}

type PartialAnswers = Partial<Record<CheckInQuestionId, string>>;

export default function CheckInFlow({ item }: CheckInFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const total = CHECK_IN_QUESTIONS.length;
  const question = CHECK_IN_QUESTIONS[step];
  const selected = answers[question.id];
  const isLast = step === total - 1;

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  // Don't fire a pending "next" after leaving the page.
  useEffect(() => clearTimer, []);

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    if (isLast) return;

    clearTimer();
    timer.current = setTimeout(() => {
      setStep((s) => Math.min(s + 1, total - 1));
    }, ADVANCE_DELAY_MS);
  }

  function handleBack() {
    clearTimer();
    setStep((s) => Math.max(0, s - 1));
  }

  function handleFinish() {
    if (!selected) return;
    const params = new URLSearchParams(answers as Record<string, string>);
    router.push(`/items/${item.id}/result?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Top bar: previous + close */}
      <div className="flex h-9 items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="-ml-2 flex items-center gap-1 rounded-full py-2 pl-2 pr-3 text-sm text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
        ) : (
          <span />
        )}

        <Link
          href="/"
          aria-label="Close check-in"
          className="-mr-2 rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
        >
          <X size={20} />
        </Link>
      </div>

      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">Check-in for</p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {item.name}
        </h1>
      </div>

      {/* Progress */}
      <div>
        <p className="mb-2 text-xs text-gray-500">
          Question {step + 1} of {total}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-medium text-gray-900">
          {question.prompt}
        </h2>

        <div
          role="radiogroup"
          aria-label={question.prompt}
          className="space-y-2"
        >
          {question.options.map((option) => {
            const isSelected = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-50 text-gray-900"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Final question only */}
      {isLast && (
        <button
          type="button"
          onClick={handleFinish}
          disabled={!selected}
          className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          See result
        </button>
      )}
    </div>
  );
}
