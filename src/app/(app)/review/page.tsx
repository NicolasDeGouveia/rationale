import { getAuthContext } from "@/server/auth-context";
import { getReviewInbox } from "@/server/services/review.service";
import { ReviewInboxView } from "@/components/review/ReviewInboxView";

export const metadata = { title: "File de révision — Rationale" };

export default async function ReviewPage() {
  const { membership } = await getAuthContext();

  const items = await getReviewInbox(membership.workspaceId);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">File de révision</h1>
        <p className="text-sm text-neutral-500 mt-1">Décisions qui nécessitent votre attention.</p>
      </div>
      <ReviewInboxView items={items} />
    </div>
  );
}
