"use client";

import { useState } from "react";
import { ReviewInboxCard } from "./ReviewInboxCard";
import { EmptyState } from "@/components/ui/empty-state";
import type { ReviewInboxItem } from "@/types";

interface ReviewInboxViewProps {
  items: ReviewInboxItem[];
}

function Section({ title, items, onAction }: { title: string; items: ReviewInboxItem[]; onAction: () => void }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{title} ({items.length})</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <ReviewInboxCard key={item.decision.id} item={item} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

export function ReviewInboxView({ items: initialItems }: ReviewInboxViewProps) {
  const [items, setItems] = useState(initialItems);

  function refresh() {
    // Items are server-rendered; trigger a page reload to get fresh data
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

  const overdue = items.filter((i) => i.urgency === "overdue");
  const dueSoon = items.filter((i) => i.urgency === "due_soon");
  const missing = items.filter((i) => i.urgency === "missing");

  return (
    <div className="space-y-8">
      <Section title="Overdue" items={overdue} onAction={refresh} />
      <Section title="Due soon" items={dueSoon} onAction={refresh} />
      <Section title="Missing review date" items={missing} onAction={refresh} />
    </div>
  );
}
