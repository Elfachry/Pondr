import type {
  CheckInAnswers,
  CheckInQuestionId,
} from "@/data/check-in-questions";
import { CONFIG } from "@/lib/pondr-config";
import { CHECK_IN_QUESTION_IDS } from "@/data/check-in-questions";
import type { Recommendation } from "@/lib/recommendation";
import type { Points } from "@/lib/scoring";
import type { ItemTrigger } from "@/types";

type Tone = "+" | "-" | "~";

const REASONS: Record<
  CheckInQuestionId,
  Record<string, { text: string; tone: Tone }>
> = {
  necessity: {
    nothing: {
      text: "Not buying this wouldn't change much for you.",
      tone: "-",
    },
    social: {
      text: "Part of the appeal is that people around you have it.",
      tone: "-",
    },
    inconvenient: {
      text: "Not having it would be somewhat inconvenient.",
      tone: "~",
    },
    affects_work: {
      text: "Not having it would affect your work or daily activities.",
      tone: "+",
    },
  },
  alternatives: {
    none: { text: "You don't own anything that does the same job.", tone: "+" },
    broken: { text: "What you have now is broken.", tone: "+" },
    outdated: {
      text: "What you have is outdated or no longer suitable.",
      tone: "+",
    },
    works: { text: "What you own still works perfectly fine.", tone: "-" },
  },
  utility: {
    daily: { text: "You expect to use it every day.", tone: "+" },
    several_week: {
      text: "You expect to use it several times a week.",
      tone: "+",
    },
    weekly: { text: "You expect to use it about once a week.", tone: "~" },
    occasionally: {
      text: "You expect to use it only occasionally.",
      tone: "-",
    },
    rarely: { text: "You expect to rarely use it.", tone: "-" },
  },
  urgency: {
    today_tomorrow: { text: "You need it today or tomorrow.", tone: "+" },
    this_week: { text: "You need it within this week.", tone: "+" },
    this_month: {
      text: "You need it within this month, so there's time to plan.",
      tone: "~",
    },
    no_deadline: {
      text: "There's no deadline, so there's no reason to rush.",
      tone: "~",
    },
  },
  persistence: {
    still_really: {
      text: "You still really want it after waiting.",
      tone: "+",
    },
    still_less: { text: "You still want it, but less than before.", tone: "~" },
    unsure: { text: "You're not sure you want it anymore.", tone: "-" },
    no_longer: { text: "You no longer really want it.", tone: "-" },
  },
  discount: {
    yes: { text: "You'd buy it even without a discount.", tone: "+" },
    maybe: { text: "A discount may be part of the appeal.", tone: "~" },
    no: { text: "You wouldn't buy it without a discount.", tone: "-" },
  },
  finances: {
    spare: { text: "You have money to spare.", tone: "+" },
    tight: { text: "You'd have less money left than you'd like.", tone: "-" },
    sacrifice: { text: "You'd have to sacrifice something else.", tone: "-" },
    borrow: { text: "You'd need to borrow money.", tone: "-" },
  },
};

export function getReasons(
  answers: CheckInAnswers,
  points: Points,
  recommendation: Recommendation,
): string[] {
  const wanted: Tone =
    recommendation === "buy_now" || recommendation === "plan_it" ? "+" : "-";
  const reasons: string[] = [];
  const used = new Set<CheckInQuestionId>();

  const take = (id: CheckInQuestionId) => {
    if (used.has(id)) return;
    reasons.push(REASONS[id][answers[id]].text);
    used.add(id);
  };

  if (answers.finances !== "spare") take("finances");

  if (
    recommendation === "plan_it" &&
    points.urgency < CONFIG.buyNow.minUrgencyPoints
  ) {
    take("urgency");
  }

  const pool = CHECK_IN_QUESTION_IDS.map((id, order) => ({
    id,
    order,
    ...REASONS[id][answers[id]],
    strength: Math.abs(points[id] - 2.5),
  }))
    .filter((e) => !used.has(e.id))
    .filter((e) => e.tone === wanted)
    .sort((a, b) => b.strength - a.strength || a.order - b.order);

  for (const e of pool) {
    if (reasons.length >= 3) break;
    reasons.push(e.text);
  }
  return reasons;
}

type Rule = { when: (p: Points) => boolean; note: string };

const MOTIVATION_RULES: Record<ItemTrigger, Rule[]> = {
  need: [
    {
      when: (p) => p.necessity >= 2,
      note: "You added this as something you need, and your answers still support that.",
    },
    {
      when: (p) => p.necessity <= 1,
      note: "You added this as something you need, but you said little would change without it.",
    },
  ],
  upgrade: [
    {
      when: (p) => p.alternatives === 0,
      note: "You wanted an upgrade, but what you own still works perfectly fine.",
    },
    {
      when: (p) =>
        (p.alternatives === 3 || p.alternatives === 4) && p.utility >= 4,
      note: "What you own is broken or outdated, and you'd use the new one often.",
    },
  ],
  like: [
    {
      when: (p) => p.persistence <= 1,
      note: "The initial excitement seems to have faded.",
    },
    {
      when: (p) => p.persistence === 5 && p.utility >= 3,
      note: "You still like it, and you expect to use it regularly.",
    },
    {
      when: (p) => p.persistence >= 3 && p.utility <= 2,
      note: "You like it, but you expect to use it only occasionally or rarely.",
    },
  ],
  self_reward: [
    {
      when: (p) => p.persistence <= 1,
      note: "The urge to reward yourself has faded.",
    },
    {
      when: (p) => p.finances <= 3,
      note: "This reward would put pressure on your budget.",
    },
    {
      when: (p) => p.persistence === 5 && p.finances === 5,
      note: "You still want this reward and can afford it comfortably.",
    },
  ],
  influenced: [
    {
      when: (p) => p.necessity === 1,
      note: "You said part of the appeal is that people around you have it.",
    },
    {
      when: (p) => p.persistence <= 1,
      note: "The influence seems to have worn off.",
    },
    {
      when: (p) => p.persistence >= 3 && p.necessity >= 2,
      note: "Someone influenced you, but you now have your own reasons for wanting it.",
    },
  ],
  discount: [
    {
      when: (p) => p.discount === 5,
      note: "It started with a sale, but you'd still buy it at full price.",
    },
    {
      when: (p) => p.discount === 0,
      note: "The sale is driving this: you wouldn't buy it without the discount.",
    },
    {
      when: (p) => p.discount === 2,
      note: "The sale may be part of the appeal.",
    },
  ],
  investment: [
    {
      when: (p) => p.utility <= 2,
      note: "You called it an investment, but you expect to use it only occasionally or rarely.",
    },
    {
      when: (p) => p.finances <= 3,
      note: "You'd have less money left than you'd like for this investment.",
    },
    {
      when: (p) => p.utility >= 4 && p.finances === 5,
      note: "You expect steady use and can afford it comfortably.",
    },
  ],
};

export function getMotivationNote(
  trigger: ItemTrigger,
  points: Points,
): string | null {
  return MOTIVATION_RULES[trigger].find((r) => r.when(points))?.note ?? null;
}
