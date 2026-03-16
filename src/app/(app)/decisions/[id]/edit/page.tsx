import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { getDecisionById } from "@/server/data-access/decisions";
import { DecisionForm } from "../_components/DecisionForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDecisionPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  const decision = await getDecisionById(id, membership.workspaceId);
  if (!decision) notFound();

  const canEdit = decision.ownerId === session.user.id || membership.role === "ADMIN";
  if (!canEdit) redirect(`/decisions/${id}`);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Edit decision</h1>
        <p className="text-sm text-neutral-500 mt-1">{decision.title}</p>
      </div>
      <DecisionForm
        mode="edit"
        decision={{
          id: decision.id,
          title: decision.title,
          summary: decision.summary ?? undefined,
          context: decision.context ?? undefined,
          rationale: decision.rationale ?? undefined,
          status: decision.status as "DRAFT" | "DECIDED" | "REOPENED" | "ARCHIVED",
          decisionDate: decision.decisionDate?.toISOString(),
          reviewDate: decision.reviewDate?.toISOString(),
        }}
        ownerId={decision.ownerId}
        ownerName={decision.owner.name}
      />
    </div>
  );
}
