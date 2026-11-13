export const CHECK_IN_QUESTION_IDS = [
  "necessity",
  "alternatives",
  "utility",
  "urgency",
  "persistence",
  "discount",
  "finances",
] as const;

export type CheckInQuestionId = (typeof CHECK_IN_QUESTION_IDS)[number];

export type CheckInAnswers = Record<CheckInQuestionId, string>;

export interface CheckInOption {
  value: string;
  label: string;
}

export interface CheckInQuestion {
  id: CheckInQuestionId;
  title: string;
  prompt: string;
  options: CheckInOption[];
}

export const CHECK_IN_QUESTIONS: CheckInQuestion[] = [
  {
    id: "necessity",
    title: "Necessity",
    prompt: "If you don't buy this item, what happens?",
    options: [
      { value: "nothing", label: "Nothing really." },
      { value: "inconvenient", label: "It would be somewhat inconvenient." },
      {
        value: "social",
        label: "I want it because my friends or people around me have it.",
      },
      {
        value: "affects_work",
        label: "My work or daily activities would be affected.",
      },
    ],
  },
  {
    id: "alternatives",
    title: "Existing alternatives",
    prompt: "Do you already own something that serves the same purpose?",
    options: [
      { value: "none", label: "No, I don't have one." },
      { value: "broken", label: "Yes, but it's broken." },
      {
        value: "outdated",
        label: "Yes, but it's outdated or no longer suitable.",
      },
      { value: "works", label: "Yes, and it still works perfectly fine." },
    ],
  },
  {
    id: "utility",
    title: "Practical utility",
    prompt: "How often do you realistically expect to use it?",
    options: [
      { value: "daily", label: "Every day." },
      { value: "several_week", label: "Several times a week." },
      { value: "weekly", label: "About once a week." },
      { value: "occasionally", label: "Occasionally." },
      { value: "rarely", label: "Rarely." },
    ],
  },
  {
    id: "urgency",
    title: "Urgency",
    prompt: "When will you actually need this item?",
    options: [
      { value: "today_tomorrow", label: "Today or tomorrow." },
      { value: "this_week", label: "Within this week." },
      { value: "few_weeks", label: "Within the next few weeks." },
      { value: "this_month", label: "Within this month." },
      { value: "no_deadline", label: "There's no particular deadline." },
    ],
  },
  {
    id: "persistence",
    title: "Desire persistence",
    prompt: "After waiting for this long, do you still want this item?",
    options: [
      { value: "still_really", label: "Yes, I still really want it." },
      { value: "still_less", label: "I still want it, but not as much." },
      { value: "unsure", label: "I'm not sure anymore." },
      { value: "no_longer", label: "I don't really want it anymore." },
    ],
  },
  {
    id: "discount",
    title: "Discount influence",
    prompt: "If there were no discounts or vouchers, would you still buy it?",
    options: [
      { value: "no", label: "No." },
      { value: "maybe", label: "Maybe." },
      { value: "yes", label: "Yes." },
    ],
  },
  {
    id: "finances",
    title: "Financial readiness",
    prompt:
      "If you bought this item right now, would you still have enough money for your other needs?",
    options: [
      { value: "spare", label: "Yes, I have money to spare." },
      {
        value: "tight",
        label: "Yes, but I'd have less money left than I'd like.",
      },
      { value: "sacrifice", label: "No, I'd have to sacrifice something else." },
      { value: "borrow", label: "I'd need to borrow money." },
    ],
  },
];