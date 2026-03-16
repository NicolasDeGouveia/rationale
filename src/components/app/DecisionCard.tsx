import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { ReviewUrgencyBadge } from "./ReviewUrgencyBadge";
import { formatDate } from "@/lib/utils";
import type { DecisionSummary } from "@/types";

interface DecisionCardProps {
  decision: DecisionSummary;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <Link
      href={`/decisions/${decision.id}`}
      className="block group border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
    >
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={decision.status} />
            {decision.reviewUrgency && (
              <ReviewUrgencyBadge urgency={decision.reviewUrgency} />
            )}
          </div>
          <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-neutral-700">
            {decision.title}
          </p>
          {decision.summary && (
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{decision.summary}</p>
          )}
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-xs text-neutral-500">{decision.owner.name ?? "—"}</p>
          {decision.reviewDate && (
            <p className="text-xs text-neutral-400 mt-0.5">
              Review {formatDate(decision.reviewDate)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
