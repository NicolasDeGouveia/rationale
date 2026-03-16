import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { getDecisionById } from "@/server/data-access/decisions";
import { DecisionDetail } from "./_components/DecisionDetail";
import { CommentSection } from "./_components/CommentSection";
import { ActivityLog } from "./_components/ActivityLog";
import type { DecisionDetail as DecisionDetailType, CommentItem, ActivityItem } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DecisionDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  const raw = await getDecisionById(id, membership.workspaceId);
  if (!raw) notFound();

  const decision: DecisionDetailType = {
    id: raw.id,
    title: raw.title,
    summary: raw.summary,
    status: raw.status as DecisionDetailType["status"],
    owner: raw.owner,
    decisionDate: raw.decisionDate?.toISOString() ?? null,
    reviewDate: raw.reviewDate?.toISOString() ?? null,
    tags: raw.tags.map((t) => t.tag.name),
    reviewUrgency: (() => {
      if (!raw.reviewDate) return "missing";
      const diff = Math.round((raw.reviewDate.getTime() - Date.now()) / 86400000);
      if (diff < 0) return "overdue";
      if (diff <= 7) return "due_soon";
      return null;
    })(),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    context: raw.context,
    rationale: raw.rationale,
    participants: [],
    alternatives: raw.alternatives.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      rejected: a.rejected,
    })),
    assumptions: raw.assumptions.map((a) => ({ id: a.id, content: a.content })),
    risks: raw.risks.map((r) => ({ id: r.id, content: r.content })),
    links: raw.links.map((l) => ({ id: l.id, url: l.url, label: l.label })),
    comments: raw.comments.map((c) => ({
      id: c.id,
      author: c.author,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    } satisfies CommentItem)),
    activity: raw.activity.map((a) => ({
      id: a.id,
      actor: a.actor,
      action: a.action as ActivityItem["action"],
      metadata: a.metadata as Record<string, unknown> | null,
      createdAt: a.createdAt.toISOString(),
    } satisfies ActivityItem)),
  };

  const canEdit = raw.ownerId === session.user.id || membership.role === "ADMIN";

  return (
    <div className="p-8 max-w-4xl">
      <DecisionDetail decision={decision} canEdit={canEdit} />
      <div className="mt-12 pt-8 border-t border-neutral-200 space-y-10">
        <CommentSection
          decisionId={id}
          comments={decision.comments}
          currentUserId={session.user.id}
        />
        <ActivityLog activity={decision.activity} />
      </div>
    </div>
  );
}
