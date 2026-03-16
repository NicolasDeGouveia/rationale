export type DecisionStatus = "DRAFT" | "DECIDED" | "REOPENED" | "ARCHIVED";

export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "COMMENTED"
  | "REVIEW_RESCHEDULED"
  | "ARCHIVED"
  | "REOPENED";

export type DecisionSummary = {
  id: string;
  title: string;
  summary: string | null;
  status: DecisionStatus;
  owner: { id: string; name: string | null };
  decisionDate: string | null;
  reviewDate: string | null;
  tags: string[];
  reviewUrgency: "overdue" | "due_soon" | "missing" | null;
  createdAt: string;
  updatedAt: string;
};

export type CommentItem = {
  id: string;
  author: { id: string; name: string | null };
  content: string;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  actor: { id: string; name: string | null };
  action: ActivityAction;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type DecisionDetail = DecisionSummary & {
  context: string | null;
  rationale: string | null;
  participants: { id: string; name: string | null }[];
  alternatives: {
    id: string;
    title: string;
    description: string | null;
    rejected: boolean;
  }[];
  assumptions: { id: string; content: string }[];
  risks: { id: string; content: string }[];
  links: { id: string; url: string; label: string | null }[];
  comments: CommentItem[];
  activity: ActivityItem[];
};
