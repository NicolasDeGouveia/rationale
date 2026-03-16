import "server-only";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import type { ActivityAction as PrismaActivityAction } from "@prisma/client";
import type { ActivityItem } from "@/types";

export async function createActivityEntry(
  decisionId: string,
  actorId: string,
  action: PrismaActivityAction,
  metadata?: Record<string, unknown>
) {
  return db.activityEntry.create({
    data: { decisionId, actorId, action, metadata: metadata as Prisma.InputJsonValue | undefined },
  });
}

export async function getActivityByDecision(decisionId: string): Promise<ActivityItem[]> {
  const entries = await db.activityEntry.findMany({
    where: { decisionId },
    include: { actor: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return entries.map((e) => ({
    id: e.id,
    actor: e.actor,
    action: e.action as ActivityItem["action"],
    metadata: e.metadata as Record<string, unknown> | null,
    createdAt: e.createdAt.toISOString(),
  }));
}
