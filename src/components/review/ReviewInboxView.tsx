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
        title="File de révision vide"
        description="Aucune décision n'est en retard, imminente ou sans date de révision."
      />
    );
  }

  const overdueItems = items.filter((i) => i.urgency === "overdue");
  const dueSoonItems = items.filter((i) => i.urgency === "due_soon");
  const missingItems = items.filter((i) => i.urgency === "missing");

  return (
    <div className="space-y-8">
      <ReviewInboxSection title="En retard" items={overdueItems} onAction={refresh} />
      <ReviewInboxSection title="Imminente" items={dueSoonItems} onAction={refresh} />
      <ReviewInboxSection title="Sans date de révision" items={missingItems} onAction={refresh} />
    </div>
  );
}
