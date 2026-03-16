import { getAuthContext } from "@/server/auth-context";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Dashboard — Rationale" };

export default async function DashboardPage() {
  const { user, membership } = await getAuthContext();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">{membership.workspace.name}</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome back, {user.name ?? user.email}</p>
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
