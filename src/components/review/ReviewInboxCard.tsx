"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ReviewUrgencyBadge } from "./ReviewUrgencyBadge";
import { StatusBadge } from "@/components/decisions/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { changeDecisionStatusAction, rescheduleReviewAction } from "@/server/actions/decision.actions";
import type { ReviewInboxItem, RescheduleFormFields } from "@/types";

interface ReviewInboxCardProps {
  item: ReviewInboxItem;
  onAction: () => void;
}

export function ReviewInboxCard({ item, onAction }: ReviewInboxCardProps) {
  const { decision, urgency, daysDelta } = item;
  const [showReschedule, setShowReschedule] = useState(false);
  const [actionError, setActionError] = useState("");
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RescheduleFormFields>();

  function handleReopen() {
    startTransition(async () => {
      const result = await changeDecisionStatusAction({ decisionId: decision.id, status: "REOPENED" });
      if (result.success) onAction();
      else setActionError(result.error);
    });
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await changeDecisionStatusAction({ decisionId: decision.id, status: "ARCHIVED" });
      if (result.success) onAction();
      else setActionError(result.error);
    });
  }

  function onReschedule({ reviewDate }: RescheduleFormFields) {
    startTransition(async () => {
      const result = await rescheduleReviewAction({ decisionId: decision.id, reviewDate });
      if (result.success) {
        setShowReschedule(false);
        reset();
        onAction();
      } else {
        setActionError(result.error);
      }
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
          <p className="text-xs text-neutral-400">Responsable</p>
          <p className="text-xs font-medium text-neutral-700">{decision.owner.name ?? "—"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          Date de révision : <span className="text-neutral-600">{formatDate(decision.reviewDate)}</span>
        </p>
        <div className="flex items-center gap-2">
          {decision.status !== "REOPENED" && (
            <Button size="sm" variant="secondary" onClick={handleReopen} loading={pending}>
              Rouvrir
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowReschedule((v) => !v)}>
            Replanifier
          </Button>
          <Button size="sm" variant="ghost" onClick={handleArchive} loading={pending}>
            Archiver
          </Button>
        </div>
      </div>

      {showReschedule && (
        <form onSubmit={handleSubmit(onReschedule)} className="flex items-center gap-2 pt-1">
          <input
            type="date"
            className="text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            {...register("reviewDate", { required: true })}
          />
          {errors.reviewDate && <p className="text-xs text-red-600">Date requise</p>}
          <Button type="submit" size="sm" loading={pending}>Confirmer</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => { setShowReschedule(false); reset(); }}>Annuler</Button>
        </form>
      )}

      {actionError && <p className="text-xs text-red-600">{actionError}</p>}
    </div>
  );
}
