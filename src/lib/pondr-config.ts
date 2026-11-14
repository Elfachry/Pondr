export const CONFIG = {
  weights: {
    necessity: 0.35,
    practical: 0.25,
    desire: 0.15,
    timing: 0.25,
  },

  timingSplit: {
    urgency: 0.4,
    finances: 0.6,
  },

  importanceSplit: {
    necessity: 0.6,
    practical: 0.4,
  },

  quadrantThreshold: 50,

  letGo: {
    lowNecessity: 50,
    lowPractical: 40,
    weakScore: 35,
  },

  worthwhile: {
    minNeedAnswerPoints: 2,
    minNeed: 50,
    minPractical: 60,
    minDesire: 50,
  },

  buyNow: {
    minScore: 75,
    minNecessity: 70,
    minPractical: 60,
    minDesire: 60,
    desireExemptNecessity: 80,
    minUrgencyPoints: 4,
    requiredFinancePoints: 5,
  },

  planItMinScore: 50,
} as const;
