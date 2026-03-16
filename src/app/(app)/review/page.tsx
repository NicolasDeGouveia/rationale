import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { getReviewInbox } from "@/server/services/review.service";
import { ReviewInboxView } from "@/components/app/ReviewInboxView";

export const metadata = { title: "Review Inbox — Rationale" };

export default async function ReviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) redirect("/onboarding");

  const items = await getReviewInbox(membership.workspaceId);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Review Inbox</h1>
        <p className="text-sm text-neutral-500 mt-1">Decisions that need your attention.</p>
      </div>
      <ReviewInboxView items={items} />
    </div>
  );
}
