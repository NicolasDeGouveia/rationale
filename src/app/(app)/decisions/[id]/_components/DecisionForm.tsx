"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AIDraftPanel } from "@/components/app/AIDraftPanel";
import { createDecisionAction, updateDecisionAction } from "@/server/actions/decision.actions";
import type { DecisionDetail, AIDraft } from "@/types";

interface DecisionFormProps {
  mode: "create" | "edit";
  decision?: Partial<DecisionDetail>;
  ownerId: string;
  ownerName?: string | null;
}

const statusOptions = [
  { value: "DECIDED", label: "Decided" },
  { value: "DRAFT", label: "Draft" },
  { value: "REOPENED", label: "Reopened" },
  { value: "ARCHIVED", label: "Archived" },
];

export function DecisionForm({ mode, decision, ownerId, ownerName }: DecisionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(decision?.title ?? "");
  const [summary, setSummary] = useState(decision?.summary ?? "");
  const [context, setContext] = useState(decision?.context ?? "");
  const [rationale, setRationale] = useState(decision?.rationale ?? "");
  const [status, setStatus] = useState(decision?.status ?? "DECIDED");
  const [reviewDate, setReviewDate] = useState(decision?.reviewDate?.slice(0, 10) ?? "");
  const [decisionDate, setDecisionDate] = useState(decision?.decisionDate?.slice(0, 10) ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      if (mode === "create") {
        const fd = new FormData();
        fd.set("title", title);
        fd.set("summary", summary);
        fd.set("context", context);
        fd.set("rationale", rationale);
        fd.set("status", status);
        fd.set("ownerId", ownerId);
        if (decisionDate) fd.set("decisionDate", decisionDate);
        if (reviewDate) fd.set("reviewDate", reviewDate);
        const result = await createDecisionAction(fd);
        if (!result.success) { setError(result.error); return; }
        router.push(`/decisions/${result.data.decisionId}`);
      } else if (decision?.id) {
        const result = await updateDecisionAction({
          decisionId: decision.id,
          title, summary, context, rationale,
          status: status as DecisionDetail["status"],
          ownerId,
          decisionDate: decisionDate || undefined,
          reviewDate: reviewDate || undefined,
          previousStatus: decision.status,
        });
        if (!result.success) { setError(result.error); return; }
        router.push(`/decisions/${result.data.decisionId}`);
      }
    });
  }

  function handleDraftReady(draft: AIDraft) {
    if (!title) setTitle(draft.title);
    if (!summary) setSummary(draft.summary);
    if (!rationale) setRationale(draft.rationale);
    if (!context) {
      const assumptionsText = draft.assumptions.length > 0 ? `Assumptions:\n${draft.assumptions.map((a) => `- ${a}`).join("\n")}` : "";
      const risksText = draft.risks.length > 0 ? `\n\nRisks:\n${draft.risks.map((r) => `- ${r}`).join("\n")}` : "";
      if (assumptionsText || risksText) setContext((assumptionsText + risksText).trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {mode === "create" && <AIDraftPanel onDraftReady={handleDraftReady} />}
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What was decided?" />
      <Textarea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A one-line summary" />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as DecisionDetail["status"])} options={statusOptions} />
        <Input label="Decision date" type="date" value={decisionDate} onChange={(e) => setDecisionDate(e.target.value)} />
      </div>

      <Input label="Review date" type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} helperText="When should this decision be revisited?" />

      <div className="space-y-1">
        <p className="text-xs text-neutral-500">Owner</p>
        <p className="text-sm text-neutral-700 font-medium">{ownerName ?? ownerId}</p>
      </div>

      <Textarea label="Context" value={context} onChange={(e) => setContext(e.target.value)} placeholder="What was the situation that led to this decision?" className="min-h-[100px]" />

      <Textarea
        label="Rationale"
        value={rationale}
        onChange={(e) => setRationale(e.target.value)}
        placeholder="Why was this decision made? What factors drove it?"
        className="min-h-[120px]"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Save decision" : "Update decision"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
