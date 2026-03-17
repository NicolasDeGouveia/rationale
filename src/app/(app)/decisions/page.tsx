import { getAuthContext } from "@/server/auth-context";
import { getDecisionsByWorkspace } from "@/server/data-access/decisions";
import { DecisionCard } from "@/components/decisions/DecisionCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Decisions — Rationale" };

export default async function DecisionsPage() {
  const { membership } = await getAuthContext();

  const decisions = await getDecisionsByWorkspace(membership.workspaceId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Decisions</h1>
        <Link href="/decisions/new">
          <Button size="sm">New decision</Button>
        </Link>
      </div>
      {decisions.length === 0 ? (
        <EmptyState
          title="No decisions yet"
          description="Start by capturing a decision your team recently made — the reasoning, the owner, and when to revisit it."
          action={
            <div className="flex flex-col items-center gap-3">
              <Link href="/decisions/new"><Button>Create first decision</Button></Link>
              <Link href="/decisions/sample" className="text-xs text-neutral-500 hover:text-neutral-700 underline underline-offset-2">
                See what a good decision record looks like
              </Link>
            </div>
          }
        />
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          {decisions.map((d) => <DecisionCard key={d.id} decision={d} />)}
        </div>
      )}
    </div>
  );
}
