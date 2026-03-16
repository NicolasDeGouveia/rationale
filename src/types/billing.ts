import type { DecisionSummary } from "./decision";

export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "UNPAID";

export type ReviewInboxItem = {
  decision: DecisionSummary;
  urgency: "overdue" | "due_soon" | "missing";
  daysDelta: number | null;
};

export type AIDraft = {
  title: string;
  summary: string;
  rationale: string;
  assumptions: string[];
  risks: string[];
};
