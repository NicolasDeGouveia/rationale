import "server-only";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import type { DecisionSummary } from "@/types";
import { REVIEW_DUE_SOON_DAYS } from "@/lib/constants";
import { upsertTag } from "./tags";

function computeUrgency(reviewDate: Date | null): DecisionSummary["reviewUrgency"] {
  if (!reviewDate) return "missing";
  const now = new Date();
  const diff = Math.round((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "overdue";
  if (diff <= REVIEW_DUE_SOON_DAYS) return "due_soon";
  return null;
}

function toDecisionSummary(d: {
  id: string; title: string; summary: string | null; status: string;
  owner: { id: string; name: string | null };
  decisionDate: Date | null; reviewDate: Date | null;
  tags: { tag: { name: string } }[];
  createdAt: Date; updatedAt: Date;
}): DecisionSummary {
  return {
    id: d.id,
    title: d.title,
    summary: d.summary,
    status: d.status as DecisionSummary["status"],
    owner: d.owner,
    decisionDate: d.decisionDate?.toISOString() ?? null,
    reviewDate: d.reviewDate?.toISOString() ?? null,
    tags: d.tags.map((t) => t.tag.name),
    reviewUrgency: computeUrgency(d.reviewDate),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
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

export async function searchDecisions(params: {
  workspaceId: string;
  query?: string;
  status?: string[];
  ownerId?: string;
  tags?: string[];
  reviewDateFrom?: string;
  reviewDateTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ decisions: DecisionSummary[]; total: number }> {
  const { workspaceId, query, status, ownerId, tags, reviewDateFrom, reviewDateTo, page = 1, pageSize = 20 } = params;

  const where: Prisma.DecisionWhereInput = {
    workspaceId,
    ...(status?.length ? { status: { in: status as Prisma.EnumDecisionStatusFilter["in"] } } : {}),
    ...(ownerId ? { ownerId } : {}),
    ...(tags?.length ? { tags: { some: { tag: { name: { in: tags } } } } } : {}),
    ...(reviewDateFrom || reviewDateTo ? {
      reviewDate: {
        ...(reviewDateFrom ? { gte: new Date(reviewDateFrom) } : {}),
        ...(reviewDateTo ? { lte: new Date(reviewDateTo) } : {}),
      }
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

  const [rows, total] = await Promise.all([
    db.decision.findMany({ where, include: summaryInclude, orderBy: { updatedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
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
  const soon = new Date(now.getTime() + REVIEW_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);
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
