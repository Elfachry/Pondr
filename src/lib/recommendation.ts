import { CONFIG } from "@/lib/pondr-config";
import type { Points, Scores } from "@/lib/scoring";

export type Recommendation = "buy_now" | "plan_it" | "rethink" | "let_go";

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  buy_now: "Buy now",
  plan_it: "Plan it",
  rethink: "Rethink",
  let_go: "Let go",
};

export function getRecommendation(
  points: Points,
  scores: Scores,
): Recommendation {
  const c = CONFIG;
  const { necessity: N, practical: P, desire: D, overall: S } = scores;

  const lowValue = N < c.letGo.lowNecessity && P < c.letGo.lowPractical;
  const letGo = lowValue && (points.persistence === 0 || S < c.letGo.weakScore);

  // creating worthwhile
  const realNeed =
    points.necessity >= c.worthwhile.minNeedAnswerPoints &&
    N >= c.worthwhile.minNeed;
  const realWant =
    P >= c.worthwhile.minPractical && D >= c.worthwhile.minDesire;
  const worthwhile = realNeed || realWant;

  const buyNow =
    S >= c.buyNow.minScore &&
    N >= c.buyNow.minNecessity &&
    P >= c.buyNow.minPractical &&
    (D >= c.buyNow.minDesire || N >= c.buyNow.desireExemptNecessity) &&
    points.urgency >= c.buyNow.minUrgencyPoints &&
    points.finances === c.buyNow.requiredFinancePoints;

  // Evaluation order from letgo and worthwhile
  if (letGo) return "let_go";
  if (!worthwhile) return "rethink";

  // Financial safeguard
  if (points.finances === 0) {
    return S >= c.planItMinScore ? "plan_it" : "rethink";
  }

  if (buyNow) return "buy_now";
  return S >= c.planItMinScore ? "plan_it" : "rethink";
}
