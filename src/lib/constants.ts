export const REVIEW_DUE_SOON_DAYS = 7;

export const DECISION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  DECIDED: "Decided",
  REOPENED: "Reopened",
  ARCHIVED: "Archived",
};

export const PLANS = {
  free: {
    name: "Free",
    description: "For individuals and small teams getting started.",
    maxDecisions: 25,
    features: ["Up to 25 decisions", "1 workspace", "Search & filtering", "Review inbox"],
  },
  pro: {
    name: "Pro",
    description: "For teams that rely on structured decision memory.",
    maxDecisions: null,
    features: [
      "Unlimited decisions",
      "Unlimited members",
      "AI-assisted drafting",
      "Priority support",
    ],
  },
} as const;

export const APP_NAME = "Rationale";
export const APP_TAGLINE = "Don't lose the why behind your team's decisions.";
