"use client";

import { ReviewInboxSection } from "./ReviewInboxSection";
import { EmptyState } from "@/components/ui/empty-state";
import type { ReviewInboxItem } from "@/types";

interface ReviewInboxViewProps {
  items: ReviewInboxItem[];
}

export function ReviewInboxView({ items }: ReviewInboxViewProps) {
  function refresh() {
    window.location.reload();
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Inbox is clear"
        description="No decisions are overdue, due soon, or missing a review date."
      />
    );
  }

  const overdueItems = items.filter((i) => i.urgency === "overdue");
  const dueSoonItems = items.filter((i) => i.urgency === "due_soon");
  const missingItems = items.filter((i) => i.urgency === "missing");

  return (
    <div className="space-y-8">
      <ReviewInboxSection title="Overdue" items={overdueItems} onAction={refresh} />
      <ReviewInboxSection title="Due soon" items={dueSoonItems} onAction={refresh} />
      <ReviewInboxSection title="Missing review date" items={missingItems} onAction={refresh} />
    </div>
  );
}
