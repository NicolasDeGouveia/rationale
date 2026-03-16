import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Dashboard — Rationale" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">{membership.workspace.name}</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome back, {session.user.name ?? session.user.email}</p>
      </div>
      <EmptyState
        title="No decisions yet"
        description="Capture your first decision to start building your team's decision memory."
        action={
          <Link href="/decisions/new">
            <Button>Create first decision</Button>
          </Link>
        }
      />
    </div>
  );
}
