import "server-only";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import type { DecisionSummary } from "@/types";
import { REVIEW_DUE_SOON_DAYS } from "@/lib/constants";
import { upsertTag } from "./tags";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type DecisionRow = {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  owner: { id: string; name: string | null };
  decisionDate: Date | null;
  reviewDate: Date | null;
  tags: { tag: { name: string } }[];
  createdAt: Date;
  updatedAt: Date;
};

export function toReviewUrgency(reviewDate: Date | null, status?: string): DecisionSummary["reviewUrgency"] {
  if (status === "ARCHIVED") return null;
  if (!reviewDate) return "missing";
  const now = new Date();
  const daysDiff = Math.round((reviewDate.getTime() - now.getTime()) / MS_PER_DAY);
  if (daysDiff < 0) return "overdue";
  if (daysDiff <= REVIEW_DUE_SOON_DAYS) return "due_soon";
  return null;
}

function toDecisionSummary(row: DecisionRow): DecisionSummary {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    status: row.status as DecisionSummary["status"],
    owner: row.owner,
    decisionDate: row.decisionDate?.toISOString() ?? null,
    reviewDate: row.reviewDate?.toISOString() ?? null,
    tags: row.tags.map((t) => t.tag.name),
    reviewUrgency: toReviewUrgency(row.reviewDate, row.status),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const summaryInclude = {
  owner: { select: { id: true, name: true } },
  tags: { include: { tag: true } },
} as const;

export async function getDecisionsByWorkspace(workspaceId: string): Promise<DecisionSummary[]> {
  const rows = await db.decision.findMany({
    where: { workspaceId },
    include: summaryInclude,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toDecisionSummary);
}

type SearchDecisionsParams = {
  workspaceId: string;
  query?: string;
  status?: string[];
  ownerId?: string;
  tags?: string[];
  reviewDateFrom?: string;
  reviewDateTo?: string;
  page?: number;
  pageSize?: number;
};

function buildSearchWhere(params: SearchDecisionsParams): Prisma.DecisionWhereInput {
  const { workspaceId, query, status, ownerId, tags, reviewDateFrom, reviewDateTo } = params;

  return {
    workspaceId,
    ...(status?.length ? { status: { in: status as Prisma.EnumDecisionStatusFilter["in"] } } : {}),
    ...(ownerId ? { ownerId } : {}),
    ...(tags?.length ? { tags: { some: { tag: { name: { in: tags } } } } } : {}),
    ...(reviewDateFrom || reviewDateTo ? {
      reviewDate: {
        ...(reviewDateFrom ? { gte: new Date(reviewDateFrom) } : {}),
        ...(reviewDateTo ? { lte: new Date(reviewDateTo) } : {}),
      },
    } : {}),
    ...(query ? {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { summary: { contains: query, mode: "insensitive" as const } },
        { rationale: { contains: query, mode: "insensitive" as const } },
        { context: { contains: query, mode: "insensitive" as const } },
      ],
    } : {}),
  };
}

export async function searchDecisions(params: SearchDecisionsParams): Promise<{ decisions: DecisionSummary[]; total: number }> {
  const { page = 1, pageSize = 20 } = params;
  const where = buildSearchWhere(params);

  const [rows, total] = await Promise.all([
    db.decision.findMany({
      where,
      include: summaryInclude,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.decision.count({ where }),
  ]);

  return { decisions: rows.map(toDecisionSummary), total };
}

export async function getDecisionById(id: string, workspaceId: string) {
  return db.decision.findFirst({
    where: { id, workspaceId },
    include: {
      ...summaryInclude,
      alternatives: true,
      assumptions: true,
      risks: true,
      links: true,
      comments: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
      activity: { include: { actor: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getReviewInboxDecisions(workspaceId: string) {
  const now = new Date();
  const soon = new Date(now.getTime() + REVIEW_DUE_SOON_DAYS * MS_PER_DAY);
  return db.decision.findMany({
    where: {
      workspaceId,
      status: { notIn: ["ARCHIVED"] },
      OR: [
        { reviewDate: { lt: now } },
        { reviewDate: { gte: now, lte: soon } },
        { reviewDate: null },
      ],
    },
    include: summaryInclude,
    orderBy: { reviewDate: "asc" },
  });
}

export async function createDecision(data: {
  workspaceId: string;
  title: string;
  summary?: string;
  context?: string;
  rationale?: string;
  status?: "DRAFT" | "DECIDED";
  ownerId: string;
  participants?: string[];
  decisionDate?: string;
  reviewDate?: string;
  alternatives?: { title: string; description?: string; rejected?: boolean }[];
  assumptions?: { content: string }[];
  risks?: { content: string }[];
  tags?: string[];
  links?: { url: string; label?: string }[];
}) {
  const tagRecords = await Promise.all(
    (data.tags ?? []).map((name) => upsertTag(data.workspaceId, name))
  );

  return db.decision.create({
    data: {
      workspaceId: data.workspaceId,
      title: data.title,
      summary: data.summary,
      context: data.context,
      rationale: data.rationale,
      status: data.status ?? "DECIDED",
      ownerId: data.ownerId,
      participants: data.participants ?? [],
      decisionDate: data.decisionDate ? new Date(data.decisionDate) : null,
      reviewDate: data.reviewDate ? new Date(data.reviewDate) : null,
      alternatives: { create: data.alternatives ?? [] },
      assumptions: { create: data.assumptions ?? [] },
      risks: { create: data.risks ?? [] },
      links: { create: data.links ?? [] },
      tags: { create: tagRecords.map((t) => ({ tagId: t.id })) },
    },
  });
}

export async function updateDecision(
  id: string,
  workspaceId: string,
  data: Partial<{
    title: string;
    summary: string;
    context: string;
    rationale: string;
    status: "DRAFT" | "DECIDED" | "REOPENED" | "ARCHIVED";
    ownerId: string;
    participants: string[];
    decisionDate: string;
    reviewDate: string;
  }>
) {
  return db.decision.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.summary !== undefined ? { summary: data.summary } : {}),
      ...(data.context !== undefined ? { context: data.context } : {}),
      ...(data.rationale !== undefined ? { rationale: data.rationale } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.ownerId !== undefined ? { ownerId: data.ownerId } : {}),
      ...(data.participants !== undefined ? { participants: data.participants } : {}),
      ...(data.decisionDate !== undefined ? { decisionDate: data.decisionDate ? new Date(data.decisionDate) : null } : {}),
      ...(data.reviewDate !== undefined ? { reviewDate: data.reviewDate ? new Date(data.reviewDate) : null } : {}),
    },
  });
}

export async function deleteDecision(id: string, workspaceId: string) {
  return db.decision.delete({ where: { id, workspaceId } });
}

export type DashboardStats = {
  total: number;
  byStatus: Record<string, number>;
  overdueCount: number;
  dueSoonCount: number;
  missingReviewCount: number;
  reopenedCount: number;
  withOwnerPct: number;
  withReviewDatePct: number;
  withRationalePct: number;
  overduePct: number;
};

export async function getDashboardStats(workspaceId: string): Promise<DashboardStats> {
  const now = new Date();
  const soon = new Date(now.getTime() + REVIEW_DUE_SOON_DAYS * MS_PER_DAY);

  const [allDecisions, overdueCount, dueSoonCount, missingReviewCount, reopenedCount] = await Promise.all([
    db.decision.findMany({
      where: { workspaceId },
      select: { status: true, ownerId: true, reviewDate: true, rationale: true },
    }),
    db.decision.count({ where: { workspaceId, reviewDate: { lt: now }, status: { notIn: ["ARCHIVED"] } } }),
    db.decision.count({ where: { workspaceId, reviewDate: { gte: now, lte: soon }, status: { notIn: ["ARCHIVED"] } } }),
    db.decision.count({ where: { workspaceId, reviewDate: null, status: { notIn: ["ARCHIVED"] } } }),
    db.decision.count({ where: { workspaceId, status: "REOPENED" } }),
  ]);

  const total = allDecisions.length;
  const byStatus: Record<string, number> = { DRAFT: 0, DECIDED: 0, REOPENED: 0, ARCHIVED: 0 };
  let withOwner = 0;
  let withReviewDate = 0;
  let withRationale = 0;

  for (const decision of allDecisions) {
    byStatus[decision.status] = (byStatus[decision.status] ?? 0) + 1;
    if (decision.ownerId) withOwner++;
    if (decision.reviewDate) withReviewDate++;
    if (decision.rationale) withRationale++;
  }

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const activeTotal = total - (byStatus["ARCHIVED"] ?? 0);

  return {
    total,
    byStatus,
    overdueCount,
    dueSoonCount,
    missingReviewCount,
    reopenedCount,
    withOwnerPct: pct(withOwner),
    withReviewDatePct: pct(withReviewDate),
    withRationalePct: pct(withRationale),
    overduePct: activeTotal > 0 ? Math.round((overdueCount / activeTotal) * 100) : 0,
  };
}

export async function getRecentActivity(workspaceId: string, limit = 8) {
  const entries = await db.activityEntry.findMany({
    where: { decision: { workspaceId } },
    include: {
      actor: { select: { id: true, name: true } },
      decision: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return entries.map((entry) => ({
    id: entry.id,
    actor: entry.actor,
    action: entry.action as string,
    decisionId: entry.decision.id,
    decisionTitle: entry.decision.title,
    createdAt: entry.createdAt.toISOString(),
  }));
}
