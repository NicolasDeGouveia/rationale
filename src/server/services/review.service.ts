import "server-only";
import { getReviewInboxDecisions, updateDecision } from "@/server/data-access/decisions";
import { createActivityEntry } from "@/server/data-access/activity";
import { REVIEW_DUE_SOON_DAYS } from "@/lib/constants";
import type { ReviewInboxItem } from "@/types";

export async function getReviewInbox(workspaceId: string): Promise<ReviewInboxItem[]> {
  const decisions = await getReviewInboxDecisions(workspaceId);
  const now = new Date();

  return decisions.map((d) => {
    let urgency: ReviewInboxItem["urgency"];
    let daysDelta: number | null = null;

    if (!d.reviewDate) {
      urgency = "missing";
    } else {
      daysDelta = Math.round((d.reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      urgency = daysDelta < 0 ? "overdue" : "due_soon";
    }

    return {
      decision: {
        id: d.id,
        title: d.title,
        summary: d.summary,
        status: d.status as ReviewInboxItem["decision"]["status"],
        owner: d.owner,
        decisionDate: d.decisionDate?.toISOString() ?? null,
        reviewDate: d.reviewDate?.toISOString() ?? null,
        tags: d.tags.map((t) => t.tag.name),
        reviewUrgency: urgency,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      },
      urgency,
      daysDelta,
    };
  });
}

export async function rescheduleReview(decisionId: string, workspaceId: string, reviewDate: string, actorId: string) {
  const decision = await updateDecision(decisionId, workspaceId, { reviewDate });
  await createActivityEntry(decisionId, actorId, "REVIEW_RESCHEDULED", { reviewDate });
  return decision;
}
