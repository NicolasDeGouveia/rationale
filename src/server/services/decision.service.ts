import "server-only";
import { createDecision, updateDecision, deleteDecision } from "@/server/data-access/decisions";
import { createActivityEntry } from "@/server/data-access/activity";
import type { DecisionCreateInput } from "@/lib/validations/decision.schema";

export async function createDecisionWithActivity(input: DecisionCreateInput & { workspaceId: string }, actorId: string) {
  const decision = await createDecision({ ...input, workspaceId: input.workspaceId });
  await createActivityEntry(decision.id, actorId, "CREATED");
  return decision;
}

export async function updateDecisionWithActivity(
  decisionId: string,
  workspaceId: string,
  data: Parameters<typeof updateDecision>[2] & { previousStatus?: string },
  actorId: string
) {
  const { previousStatus, ...updateData } = data;
  const decision = await updateDecision(decisionId, workspaceId, updateData);
  const action = updateData.status && updateData.status !== previousStatus ? "STATUS_CHANGED" : "UPDATED";
  await createActivityEntry(decisionId, actorId, action, updateData.status ? { status: updateData.status } : undefined);
  return decision;
}

export async function deleteDecisionWithCheck(decisionId: string, workspaceId: string, actorId: string, actorRole: string) {
  const decision = await import("@/server/data-access/decisions").then((m) => m.getDecisionById(decisionId, workspaceId));
  if (!decision) throw new Error("Decision not found");
  if (decision.ownerId !== actorId && actorRole !== "ADMIN") {
    throw new Error("Only the owner or an admin can delete this decision");
  }
  return deleteDecision(decisionId, workspaceId);
}
