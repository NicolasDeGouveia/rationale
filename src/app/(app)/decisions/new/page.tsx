import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { DecisionForm } from "../[id]/_components/DecisionForm";

export const metadata = { title: "New Decision — Rationale" };

export default async function NewDecisionPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">New decision</h1>
        <p className="text-sm text-neutral-500 mt-1">Capture what was decided and why.</p>
      </div>
      <DecisionForm mode="create" ownerId={session.user.id} ownerName={session.user.name} />
    </div>
  );
}
