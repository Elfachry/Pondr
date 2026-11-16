import type {
  CheckInAnswers,
  CheckInQuestionId,
} from "@/data/check-in-questions";
import { CONFIG } from "@/lib/pondr-config";

export const ANSWER_POINTS: Record<
  CheckInQuestionId,
  Record<string, number>
> = {
  // Q1
  necessity: {
    nothing: 0,
    social: 1,
    inconvenient: 2,
    affects_work: 5,
  },
  // Q2
  alternatives: {
    none: 5,
    broken: 4,
    outdated: 3,
    works: 0,
  },
  // Q3
  utility: {
    daily: 5,
    several_week: 4,
    weekly: 3,
    occasionally: 2,
    rarely: 0,
  },
  // Q4
  urgency: {
    today_tomorrow: 5,
    this_week: 4,
    this_month: 2,
    no_deadline: 0,
  },
  // Q5
  persistence: {
    still_really: 5,
    still_less: 3,
    unsure: 1,
    no_longer: 0,
  },
  // Q6
  discount: {
    yes: 5,
    maybe: 2,
    no: 0,
  },
  // Q7
  finances: {
    spare: 5,
    tight: 3,
    sacrifice: 0,
    borrow: 0,
  },
};

export type Points = Record<CheckInQuestionId, number>;

export interface Scores {
  necessity: number;
  practical: number;
  desire: number;
  urgency: number;
  finances: number;
  timing: number;
  overall: number;
  importance: number;
}

export type Quadrant = "A" | "B" | "C" | "D";

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  A: "I",
  B: "II",
  C: "III",
  D: "IV",
};

export function getPoints(answers: Partial<CheckInAnswers>): Points {
  const points = {} as Points;

  for (const id of Object.keys(ANSWER_POINTS) as CheckInQuestionId[]) {
    const value = answers[id];

    if (value === undefined) {
      throw new Error(`Missing answer for question "${id}".`);
    }

    const score = ANSWER_POINTS[id][value];

    if (score === undefined) {
      throw new Error(`Unknown answer "${value}" for question "${id}".`);
    }

    points[id] = score;
  }

  return points;
}

export function calculateScores(points: Points): Scores {
  const { weights, timingSplit, importanceSplit } = CONFIG;

  const necessity = ((points.necessity + points.alternatives) / 10) * 100;
  const practical = (points.utility / 5) * 100;
  const desire = ((points.persistence + points.discount) / 10) * 100;

  const urgency = (points.urgency / 5) * 100;
  const finances = (points.finances / 5) * 100;
  const timing =
    urgency * timingSplit.urgency + finances * timingSplit.finances;

  const overall =
    necessity * weights.necessity +
    practical * weights.practical +
    desire * weights.desire +
    timing * weights.timing;

  const importance =
    necessity * importanceSplit.necessity +
    practical * importanceSplit.practical;

  return {
    necessity: Math.round(necessity),
    practical: Math.round(practical),
    desire: Math.round(desire),
    urgency: Math.round(urgency),
    finances: Math.round(finances),
    timing: Math.round(timing),
    overall: Math.round(overall),
    importance: Math.round(importance),
  };
}

export function getQuadrant(scores: Scores): Quadrant {
  const cut = CONFIG.quadrantThreshold;
  const important = scores.importance >= cut;
  const urgent = scores.urgency >= cut;

  if (important && urgent) return "A";
  if (important) return "B";
  if (urgent) return "C";
  return "D";
}
