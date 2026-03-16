import { ReviewInboxCard } from "./ReviewInboxCard";
import type { ReviewInboxItem } from "@/types";

interface ReviewInboxSectionProps {
  title: string;
  items: ReviewInboxItem[];
  onAction: () => void;
}

export function ReviewInboxSection({ title, items, onAction }: ReviewInboxSectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
        {title} ({items.length})
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <ReviewInboxCard key={item.decision.id} item={item} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}
