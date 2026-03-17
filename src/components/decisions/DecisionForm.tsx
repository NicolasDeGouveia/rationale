"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

  function onSubmit(data: DecisionFormFields) {
    startTransition(async () => {
      if (mode === "create") {
        const fd = new FormData();
        fd.set("title", data.title);
        fd.set("summary", data.summary);
        fd.set("context", data.context);
        fd.set("rationale", data.rationale);
        fd.set("status", data.status);
        fd.set("ownerId", ownerId);
        if (data.decisionDate) fd.set("decisionDate", data.decisionDate);
        if (data.reviewDate) fd.set("reviewDate", data.reviewDate);
        const result = await createDecisionAction(fd);
        if (!result.success) { setError("root", { message: result.error }); return; }
        router.push(`/decisions/${result.data.decisionId}`);
      } else if (decision?.id) {
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
    });
  }

  function handleDraftReady(draft: AIDraft) {
    if (!getValues("title")) setValue("title", draft.title);
    if (!getValues("summary")) setValue("summary", draft.summary);
    if (!getValues("rationale")) setValue("rationale", draft.rationale);
    if (!getValues("context")) {
      const assumptionsText = draft.assumptions.length > 0 ? `Assumptions:\n${draft.assumptions.map((a) => `- ${a}`).join("\n")}` : "";
      const risksText = draft.risks.length > 0 ? `\n\nRisks:\n${draft.risks.map((r) => `- ${r}`).join("\n")}` : "";
      if (assumptionsText || risksText) setValue("context", (assumptionsText + risksText).trim());
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {mode === "create" && <AIDraftPanel onDraftReady={handleDraftReady} />}

      <Input
        label="Title"
        placeholder="What was decided?"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />
      <Textarea
        label="Summary"
        placeholder="A one-line summary"
        {...register("summary")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={DECISION_STATUS_OPTIONS}
          {...register("status")}
        />
        <Input
          label="Decision date"
          type="date"
          {...register("decisionDate")}
        />
      </div>

      <Input
        label="Review date"
        type="date"
        helperText="When should this decision be revisited?"
        {...register("reviewDate")}
      />

      <div className="space-y-1">
        <p className="text-xs text-neutral-500">Owner</p>
        <p className="text-sm text-neutral-700 font-medium">{ownerName ?? ownerId}</p>
      </div>

      <Textarea
        label="Context"
        placeholder="What was the situation that led to this decision?"
        className="min-h-24"
        {...register("context")}
      />
      <Textarea
        label="Rationale"
        placeholder="Why was this decision made? What factors drove it?"
        className="min-h-32"
        {...register("rationale")}
      />

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
