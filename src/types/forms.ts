import type { DecisionStatus } from "./decision";

export type LoginFormFields = {
  email: string;
  password: string;
};

export type SignupFormFields = {
  name: string;
  email: string;
  password: string;
};

export type WorkspaceFormFields = {
  name: string;
};

export type DecisionFormFields = {
  title: string;
  summary: string;
  context: string;
  rationale: string;
  status: DecisionStatus;
  decisionDate: string;
  reviewDate: string;
};

export type CommentFormFields = {
  content: string;
};

export type AIDraftFormFields = {
  notes: string;
};

export type RescheduleFormFields = {
  reviewDate: string;
};
