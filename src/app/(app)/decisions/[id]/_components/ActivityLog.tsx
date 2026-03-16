import { formatRelativeDate } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const ACTION_LABELS: Record<ActivityItem["action"], string> = {
  CREATED: "created this decision",
  UPDATED: "updated this decision",
  STATUS_CHANGED: "changed the status",
  COMMENTED: "added a comment",
  REVIEW_RESCHEDULED: "rescheduled the review",
  ARCHIVED: "archived this decision",
  REOPENED: "reopened this decision",
};

interface ActivityLogProps {
  activity: ActivityItem[];
}

export function ActivityLog({ activity }: ActivityLogProps) {
  if (activity.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Activity</h2>
      <ul className="space-y-3">
        {activity.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-neutral-700">{entry.actor.name ?? "Someone"}</span>
              {" "}
              <span className="text-neutral-500">{ACTION_LABELS[entry.action] ?? entry.action}</span>
              {entry.metadata?.status != null && (
                <span className="ml-1 text-neutral-400">→ {String(entry.metadata.status).toLowerCase()}</span>
              )}
              <span className="ml-2 text-xs text-neutral-400">{formatRelativeDate(entry.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
