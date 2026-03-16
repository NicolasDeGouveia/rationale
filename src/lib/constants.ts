export const REVIEW_DUE_SOON_DAYS = 7;

export const DECISION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  DECIDED: "Decided",
  REOPENED: "Reopened",
  ARCHIVED: "Archived",
};

export const DECISION_STATUS_OPTIONS = [
  { value: "DECIDED", label: "Decided" },
  { value: "DRAFT", label: "Draft" },
  { value: "REOPENED", label: "Reopened" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export const ACTIVITY_ACTION_LABELS: Record<string, string> = {
  CREATED: "created this decision",
  UPDATED: "updated this decision",
  STATUS_CHANGED: "changed the status",
  COMMENTED: "added a comment",
  REVIEW_RESCHEDULED: "rescheduled the review",
  ARCHIVED: "archived this decision",
  REOPENED: "reopened this decision",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  TRIALING: { label: "Trial", color: "text-blue-700 bg-blue-50 border-blue-200" },
  PAST_DUE: { label: "Past due", color: "text-red-700 bg-red-50 border-red-200" },
  CANCELED: { label: "Canceled", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
  INCOMPLETE: { label: "Incomplete", color: "text-amber-700 bg-amber-50 border-amber-200" },
  PAUSED: { label: "Paused", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
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
