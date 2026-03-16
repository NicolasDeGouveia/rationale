"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ReviewUrgencyBadge } from "./ReviewUrgencyBadge";
import { StatusBadge } from "@/components/decisions/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { changeDecisionStatusAction, rescheduleReviewAction } from "@/server/actions/decision.actions";
import type { ReviewInboxItem } from "@/types";

interface ReviewInboxCardProps {
  item: ReviewInboxItem;
  onAction: () => void;
}

export function ReviewInboxCard({ item, onAction }: ReviewInboxCardProps) {
  const { decision, urgency, daysDelta } = item;
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleReopen() {
    startTransition(async () => {
      const result = await changeDecisionStatusAction({ decisionId: decision.id, status: "REOPENED" });
      if (result.success) onAction();
      else setError(result.error);
    });
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await changeDecisionStatusAction({ decisionId: decision.id, status: "ARCHIVED" });
      if (result.success) onAction();
      else setError(result.error);
    });
  }

  function handleReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate) return;
    startTransition(async () => {
      const result = await rescheduleReviewAction({ decisionId: decision.id, reviewDate: newDate });
      if (result.success) { setShowReschedule(false); onAction(); }
      else setError(result.error);
    });
  }

  return (
    <div className="p-4 border border-neutral-200 rounded-lg bg-white space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ReviewUrgencyBadge urgency={urgency} daysDelta={daysDelta} />
            <StatusBadge status={decision.status} />
          </div>
          <Link href={`/decisions/${decision.id}`} className="text-sm font-semibold text-neutral-900 hover:underline line-clamp-2">
            {decision.title}
          </Link>
          {decision.summary && (
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{decision.summary}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-neutral-400">Owner</p>
          <p className="text-xs font-medium text-neutral-700">{decision.owner.name ?? "—"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          Review date: <span className="text-neutral-600">{formatDate(decision.reviewDate)}</span>
        </p>
        <div className="flex items-center gap-2">
          {decision.status !== "REOPENED" && (
            <Button size="sm" variant="secondary" onClick={handleReopen} loading={pending}>
              Reopen
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setShowReschedule((v) => !v)} loading={false}>
            Reschedule
          </Button>
          <Button size="sm" variant="ghost" onClick={handleArchive} loading={pending}>
            Archive
          </Button>
        </div>
      </div>

      {showReschedule && (
        <form onSubmit={handleReschedule} className="flex items-center gap-2 pt-1">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            required
          />
          <Button type="submit" size="sm" loading={pending}>Confirm</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowReschedule(false)}>Cancel</Button>
        </form>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
