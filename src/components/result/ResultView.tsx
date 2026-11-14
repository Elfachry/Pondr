import Link from "next/link";
import type { Item } from "@/types";
import {
  RECOMMENDATION_LABELS,
  type Recommendation,
} from "@/lib/recommendation";
import { QUADRANT_LABELS, type Quadrant, type Scores } from "@/lib/scoring";

const RECOMMENDATION_STYLES: Record<
  Recommendation,
  { card: string; eyebrow: string; label: string }
> = {
  buy_now: {
    card: "border-emerald-200 bg-emerald-50",
    eyebrow: "text-emerald-700",
    label: "text-emerald-900",
  },
  plan_it: {
    card: "border-blue-200 bg-blue-50",
    eyebrow: "text-blue-700",
    label: "text-blue-900",
  },
  rethink: {
    card: "border-amber-200 bg-amber-50",
    eyebrow: "text-amber-700",
    label: "text-amber-900",
  },
  let_go: {
    card: "border-red-200 bg-red-50",
    eyebrow: "text-red-700",
    label: "text-red-900",
  },
};

const NEXT_STEPS: Record<Recommendation, string> = {
  buy_now: "Compare prices and find a suitable product.",
  plan_it: "Set a savings target and a future purchase date.",
  rethink:
    "Wait longer, consider alternatives, and reconsider your motivation.",
  let_go: "Drop the item and record the money you didn't spend.",
};

const QUADRANT_CELLS: {
  q: Quadrant;
  caption: string;
  position: string;
}[] = [
  {
    q: "A",
    caption: "Important + Urgent",
    position: "justify-start items-start",
  },
  {
    q: "B",
    caption: "Important + Not urgent",
    position: "justify-start items-end text-right",
  },
  {
    q: "C",
    caption: "Less important + Urgent",
    position: "justify-end items-start",
  },
  {
    q: "D",
    caption: "Less important + Not urgent",
    position: "justify-end items-end text-right",
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const cardClass = "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

interface ResultViewProps {
  item: Item;
  recommendation: Recommendation;
  quadrant: Quadrant;
  scores: Scores;
  reasons: string[];
  motivationNote: string | null;
}

export default function ResultView({
  item,
  recommendation,
  quadrant,
  scores,
  reasons,
  motivationNote,
}: ResultViewProps) {
  const style = RECOMMENDATION_STYLES[recommendation];
  const price = `Rp ${item.price.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* 1. Item header: price is context only */}
      <div>
        <p className="text-sm text-gray-500">Check-in result</p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {item.name}
        </h1>
        <p className="mt-1 text-sm text-gray-400">{price}</p>
      </div>

      {/* 2. Recommendation (score intentionally hidden in v1) */}
      <div className={`rounded-2xl border p-7 ${style.card}`}>
        <p className={`text-sm font-medium ${style.eyebrow}`}>Pondr suggests</p>
        <p
          className={`mt-1 text-4xl font-semibold tracking-tight ${style.label}`}
        >
          {RECOMMENDATION_LABELS[recommendation]}
        </p>
      </div>

      {/* 3. Why: up to 3 reasons + motivation note */}
      <section className={cardClass}>
        <h2 className="mb-3 font-medium text-gray-900">Why</h2>

        <ul className="space-y-2 text-sm text-gray-600">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span aria-hidden className="text-gray-300">
                •
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        {(motivationNote || item.reason) && (
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
            {motivationNote && (
              <p className="text-gray-500">{motivationNote}</p>
            )}
            {item.reason && (
              <p className="text-gray-400">You wrote: “{item.reason}”</p>
            )}
          </div>
        )}
      </section>

      {/* 4. Priority map */}
      <section className={cardClass}>
        <h2 className="mb-3 font-medium text-gray-900">Priority map</h2>

        <div
          role="img"
          aria-label={`Priority map: ${QUADRANT_LABELS[quadrant]}`}
          className="relative grid h-64 grid-cols-2 grid-rows-2 overflow-hidden rounded-2xl border border-gray-200"
        >
          {QUADRANT_CELLS.map(({ q, caption, position }) => {
            const active = q === quadrant;

            return (
              <div
                key={q}
                className={`flex flex-col border border-dashed border-gray-200 p-3 ${position} ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                <span
                  className={`text-xs ${
                    active ? "font-semibold text-gray-900" : "text-gray-400"
                  }`}
                >
                  {QUADRANT_LABELS[q]}
                </span>
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {caption}
                </span>
              </div>
            );
          })}

          <div
            className="absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-zinc-900/20 bg-zinc-900"
            style={{
              left: `${clamp(100 - scores.urgency, 4, 96)}%`,
              top: `${clamp(100 - scores.importance, 4, 96)}%`,
            }}
          />
        </div>
      </section>

      {/* 5. Suggested next step */}
      <section className={cardClass}>
        <h2 className="mb-2 font-medium text-gray-900">Suggested next step</h2>
        <p className="text-sm text-gray-600">{NEXT_STEPS[recommendation]}</p>
      </section>

      {/* 6. Your decision (placeholders until storage exists) */}
      <section>
        <p className="mb-1 text-sm font-medium text-gray-900">You decide</p>
        <p className="mb-3 text-sm text-gray-500">
          Pondr recommends. The final choice is yours.
        </p>

        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/" // TODO: set status to "bought"
            className="rounded-xl bg-zinc-900 px-3 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Bought
          </Link>
          <Link
            href="/" // TODO: push reviewAt forward
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-sm text-gray-700 transition hover:border-gray-400"
          >
            Keep waiting
          </Link>
          <Link
            href="/" // TODO: set status to "dropped" and record item.price
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-sm text-gray-700 transition hover:border-gray-400"
          >
            Drop
          </Link>
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          Dropping this keeps {price} in your pocket.
        </p>
      </section>
    </div>
  );
}
