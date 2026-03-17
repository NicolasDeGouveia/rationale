"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/tooltip";
import { AIDraftPanel } from "@/components/ai/AIDraftPanel";
import { createDecisionAction, updateDecisionAction } from "@/server/actions/decision.actions";
import { DECISION_STATUS_OPTIONS } from "@/lib/constants";
import type { DecisionDetail, AIDraft, DecisionFormFields } from "@/types";

interface DecisionFormProps {
  mode: "create" | "edit";
  decision?: Partial<DecisionDetail>;
  ownerId: string;
  ownerName?: string | null;
}

function buildFormData(data: DecisionFormFields, ownerId: string): FormData {
  const formData = new FormData();
  formData.set("title", data.title);
  formData.set("summary", data.summary);
  formData.set("context", data.context);
  formData.set("rationale", data.rationale);
  formData.set("status", data.status);
  formData.set("ownerId", ownerId);
  if (data.decisionDate) formData.set("decisionDate", data.decisionDate);
  if (data.reviewDate) formData.set("reviewDate", data.reviewDate);
  return formData;
}

function buildContextFromDraft(draft: AIDraft): string {
  const parts: string[] = [];
  if (draft.assumptions.length > 0) {
    parts.push(`Assumptions:\n${draft.assumptions.map((a) => `- ${a}`).join("\n")}`);
  }
  if (draft.risks.length > 0) {
    parts.push(`Risks:\n${draft.risks.map((r) => `- ${r}`).join("\n")}`);
  }
  return parts.join("\n\n");
}

export function DecisionForm({ mode, decision, ownerId, ownerName }: DecisionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DecisionFormFields>({
    defaultValues: {
      title: decision?.title ?? "",
      summary: decision?.summary ?? "",
      context: decision?.context ?? "",
      rationale: decision?.rationale ?? "",
      status: decision?.status ?? "DECIDED",
      decisionDate: decision?.decisionDate?.slice(0, 10) ?? "",
      reviewDate: decision?.reviewDate?.slice(0, 10) ?? "",
    },
  });

  async function handleCreate(data: DecisionFormFields) {
    const result = await createDecisionAction(buildFormData(data, ownerId));
    if (!result.success) { setError("root", { message: result.error }); return; }
    router.push(`/decisions/${result.data.decisionId}`);
  }

  async function handleUpdate(data: DecisionFormFields) {
    if (!decision?.id) return;
    const result = await updateDecisionAction({
      decisionId: decision.id,
      title: data.title,
      summary: data.summary,
      context: data.context,
      rationale: data.rationale,
      status: data.status,
      ownerId,
      decisionDate: data.decisionDate || undefined,
      reviewDate: data.reviewDate || undefined,
      previousStatus: decision.status,
    });
    if (!result.success) { setError("root", { message: result.error }); return; }
    router.push(`/decisions/${result.data.decisionId}`);
  }

  function onSubmit(data: DecisionFormFields) {
    startTransition(async () => {
      if (mode === "create") await handleCreate(data);
      else await handleUpdate(data);
    });
  }

  function handleDraftReady(draft: AIDraft) {
    if (!getValues("title")) setValue("title", draft.title);
    if (!getValues("summary")) setValue("summary", draft.summary);
    if (!getValues("rationale")) setValue("rationale", draft.rationale);
    if (!getValues("context")) {
      const context = buildContextFromDraft(draft);
      if (context) setValue("context", context);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {mode === "create" && <AIDraftPanel onDraftReady={handleDraftReady} />}

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="title">Title</label>
          <InfoIcon tooltip="Describe the choice that was made, not the task or ticket. A good title reads like a decision: 'Use PostgreSQL for the analytics pipeline' rather than 'Backend update'." />
        </div>
        <Input
          id="title"
          placeholder="e.g. Delay Salesforce integration until support capacity improves"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />
        <p className="text-xs text-neutral-400">Phrase it as a choice, not a task. Be specific about what was decided.</p>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="summary">Summary</label>
          <InfoIcon tooltip="A single sentence that captures the essence of the decision. Should stand alone — someone skimming the list should understand the decision without opening it." />
        </div>
        <Textarea
          id="summary"
          placeholder="e.g. We chose to delay the Salesforce integration by one quarter to avoid overloading the support team during onboarding season."
          {...register("summary")}
        />
        <p className="text-xs text-neutral-400">One sentence. What was decided, and for what reason?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="status">Status</label>
            <InfoIcon tooltip="Draft: still being discussed. Decided: final and active. Reopened: previously decided but under review again. Archived: no longer relevant." />
          </div>
          <Select
            id="status"
            options={DECISION_STATUS_OPTIONS}
            {...register("status")}
          />
          <p className="text-xs text-neutral-400">Most decisions should be set to Decided.</p>
        </div>

        {/* Decision date */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="decisionDate">Decision date</label>
            <InfoIcon tooltip="The date the decision was actually made — not when you're documenting it. This matters for audits and understanding the timeline." />
          </div>
          <Input
            id="decisionDate"
            type="date"
            {...register("decisionDate")}
          />
        </div>
      </div>

      {/* Review date */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="reviewDate">Review date</label>
          <InfoIcon tooltip="Set a date to revisit this decision. Circumstances change — a 6-month check-in ensures decisions don't go stale. Overdue decisions appear in the Review Inbox." />
        </div>
        <Input
          id="reviewDate"
          type="date"
          {...register("reviewDate")}
        />
        <p className="text-xs text-neutral-400">When should this be revisited? Overdue decisions surface in the Review Inbox.</p>
      </div>

      {/* Owner */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Owner</span>
          <InfoIcon tooltip="The person accountable for this decision — not necessarily who made it. The owner is responsible for monitoring outcomes and acting on the review date." />
        </div>
        <p className="text-sm text-neutral-700 font-medium">{ownerName ?? ownerId}</p>
        <p className="text-xs text-neutral-400">Accountable for monitoring this decision and responding when it's due for review.</p>
      </div>

      {/* Context */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="context">Context</label>
          <InfoIcon tooltip="Describe the situation that made this decision necessary. What constraints, pressures, or events led here? This is the 'before' picture — without it, the rationale won't make sense later." />
        </div>
        <Textarea
          id="context"
          placeholder="e.g. Our support team is already at capacity during the Q3 onboarding cycle. Adding a Salesforce integration would require 3 weeks of setup and training. The integration was originally planned for Q3 but team bandwidth changed."
          className="min-h-24"
          {...register("context")}
        />
        <p className="text-xs text-neutral-400">What situation, constraints, or events made this decision necessary?</p>
      </div>

      {/* Rationale */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="rationale">Rationale</label>
          <InfoIcon tooltip="Explain why this option was chosen over the alternatives. What factors were decisive? What trade-offs were accepted? This is the most important field — it's the reason Rationale exists." />
        </div>
        <Textarea
          id="rationale"
          placeholder="e.g. Delaying reduces support team risk during a critical period. The integration provides low immediate value vs. the setup cost. We evaluated bringing in a contractor but the onboarding overhead made it impractical. We'll revisit in Q4 when capacity improves."
          className="min-h-32"
          {...register("rationale")}
        />
        <p className="text-xs text-neutral-400">Why this option? What trade-offs were accepted? What alternatives were ruled out?</p>
      </div>

      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Save decision" : "Update decision"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
