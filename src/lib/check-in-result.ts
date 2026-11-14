import {
  CHECK_IN_QUESTIONS,
  type CheckInAnswers,
} from "@/data/check-in-questions";
import { getRecommendation } from "@/lib/recommendation";
import { calculateScores, getPoints, getQuadrant } from "@/lib/scoring";

export function parseAnswers(
  searchParams: Record<string, string | string[] | undefined>,
): CheckInAnswers | null {
  const answers = {} as CheckInAnswers;

  for (const q of CHECK_IN_QUESTIONS) {
    const value = searchParams[q.id];
    if (typeof value !== "string") return null;
    if (!q.options.some((o) => o.value === value)) return null;
    answers[q.id] = value;
  }
  return answers;
}

export function evaluateCheckIn(answers: CheckInAnswers) {
  const points = getPoints(answers);
  const scores = calculateScores(points);
  return {
    points,
    scores,
    recommendation: getRecommendation(points, scores),
    quadrant: getQuadrant(scores),
  };
}
