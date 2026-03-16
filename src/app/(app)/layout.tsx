import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { getReviewInboxDecisions } from "@/server/data-access/decisions";
import { Sidebar } from "@/components/app/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  const reviewItems = await getReviewInboxDecisions(membership.workspaceId);
  const reviewCount = reviewItems.filter((d) => {
    if (!d.reviewDate) return false;
    return d.reviewDate < new Date();
  }).length;

  return (
    <div className="flex h-screen bg-neutral-50">
      <div className="w-56 shrink-0 border-r border-neutral-200 bg-white">
        <Sidebar workspaceName={membership.workspace.name} reviewCount={reviewCount} />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
