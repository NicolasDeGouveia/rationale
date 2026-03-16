"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { createDecisionWithActivity, updateDecisionWithActivity, deleteDecisionWithCheck } from "@/server/services/decision.service";
import { searchDecisions } from "@/server/data-access/decisions";
import { decisionCreateSchema, decisionUpdateSchema, decisionStatusSchema, searchDecisionsSchema, commentSchema, rescheduleReviewSchema } from "@/lib/validations/decision.schema";
import { rescheduleReview } from "@/server/services/review.service";

async function getSessionAndWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) return null;
  return { user: session.user, membership };
}

export async function createDecisionAction(formData: FormData) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  const raw = Object.fromEntries(formData.entries());
  const parsed = decisionCreateSchema.safeParse({
    ...raw,
    participants: formData.getAll("participants"),
    tags: formData.getAll("tags"),
  });
  if (!parsed.success) {
    return { success: false, error: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors } as const;
  }

  try {
    const decision = await createDecisionWithActivity(
      { ...parsed.data, workspaceId: ctx.membership.workspaceId },
      ctx.user.id
    );
    return { success: true, data: { decisionId: decision.id } } as const;
  } catch {
    return { success: false, error: "Failed to create decision" } as const;
  }
}

export async function updateDecisionAction(input: {
  decisionId: string;
  title?: string;
  summary?: string;
  context?: string;
  rationale?: string;
  status?: "DRAFT" | "DECIDED" | "REOPENED" | "ARCHIVED";
  ownerId?: string;
  participants?: string[];
  decisionDate?: string;
  reviewDate?: string;
  previousStatus?: string;
}) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  try {
    const decision = await updateDecisionWithActivity(
      input.decisionId,
      ctx.membership.workspaceId,
      input,
      ctx.user.id
    );
    return { success: true, data: { decisionId: decision.id } } as const;
  } catch {
    return { success: false, error: "Failed to update decision" } as const;
  }
}

export async function changeDecisionStatusAction(input: { decisionId: string; status: "DRAFT" | "DECIDED" | "REOPENED" | "ARCHIVED" }) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  const parsed = decisionStatusSchema.safeParse({ ...input, workspaceId: ctx.membership.workspaceId });
  if (!parsed.success) return { success: false, error: "Invalid input" } as const;

  try {
    const decision = await updateDecisionWithActivity(
      parsed.data.decisionId,
      parsed.data.workspaceId,
      { status: parsed.data.status },
      ctx.user.id
    );
    return { success: true, data: { decisionId: decision.id, status: decision.status } } as const;
  } catch {
    return { success: false, error: "Failed to change status" } as const;
  }
}

export async function searchDecisionsAction(input: Omit<Parameters<typeof searchDecisions>[0], "workspaceId">) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  try {
    const result = await searchDecisions({ ...input, workspaceId: ctx.membership.workspaceId });
    return { success: true, data: result } as const;
  } catch {
    return { success: false, error: "Search failed" } as const;
  }
}

export async function rescheduleReviewAction(input: { decisionId: string; reviewDate: string }) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  const parsed = rescheduleReviewSchema.safeParse({ ...input, workspaceId: ctx.membership.workspaceId });
  if (!parsed.success) return { success: false, error: "Invalid input" } as const;

  try {
    await rescheduleReview(parsed.data.decisionId, parsed.data.workspaceId, parsed.data.reviewDate, ctx.user.id);
    return { success: true, data: { reviewDate: parsed.data.reviewDate } } as const;
  } catch {
    return { success: false, error: "Failed to reschedule review" } as const;
  }
}
