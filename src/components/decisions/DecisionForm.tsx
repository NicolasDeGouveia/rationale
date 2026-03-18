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
  aiEnabled?: boolean;
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

const today = new Date().toISOString().slice(0, 10);

export function DecisionForm({ mode, decision, ownerId, ownerName, aiEnabled = false }: DecisionFormProps) {
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
      {mode === "create" && aiEnabled && <AIDraftPanel onDraftReady={handleDraftReady} />}

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="title">Titre</label>
          <InfoIcon tooltip="Décrivez le choix effectué, pas la tâche ou le ticket. Un bon titre se lit comme une décision : 'Utiliser PostgreSQL pour le pipeline analytique' plutôt que 'Mise à jour backend'." />
        </div>
        <Input
          id="title"
          placeholder="ex. Repousser l'intégration Salesforce jusqu'à ce que la capacité du support s'améliore"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />
        <p className="text-xs text-neutral-400">Formulez-le comme un choix, pas une tâche. Soyez précis sur ce qui a été décidé.</p>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="summary">Résumé</label>
          <InfoIcon tooltip="Une seule phrase qui capture l'essentiel de la décision. Elle doit se suffire à elle-même — quelqu'un qui parcourt la liste doit comprendre la décision sans l'ouvrir." />
        </div>
        <Textarea
          id="summary"
          placeholder="ex. Nous avons choisi de reporter l'intégration Salesforce d'un trimestre pour éviter de surcharger l'équipe support pendant la saison d'onboarding."
          {...register("summary")}
        />
        <p className="text-xs text-neutral-400">Une phrase. Qu'est-ce qui a été décidé, et pour quelle raison ?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="status">Statut</label>
            <InfoIcon tooltip="Brouillon : encore en discussion. Décidé : final et actif. Rouvert : précédemment décidé mais en réévaluation. Archivé : plus pertinent." />
          </div>
          <Select
            id="status"
            options={DECISION_STATUS_OPTIONS}
            {...register("status")}
          />
          <p className="text-xs text-neutral-400">La plupart des décisions doivent être à l&apos;état Décidé.</p>
        </div>

        {/* Decision date */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="decisionDate">Date de décision</label>
            <InfoIcon tooltip="La date à laquelle la décision a réellement été prise — pas quand vous la documentez. Important pour les audits et la compréhension de la chronologie." />
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
          <label className="text-sm font-medium text-neutral-700" htmlFor="reviewDate">Date de révision</label>
          <InfoIcon tooltip="Fixez une date pour réévaluer cette décision. Les circonstances changent — un point à 6 mois évite que les décisions ne deviennent obsolètes. Les décisions en retard apparaissent dans la file de révision." />
        </div>
        <Input
          id="reviewDate"
          type="date"
          min={today}
          error={errors.reviewDate?.message}
          {...register("reviewDate", {
            validate: (v) => !v || v >= today || "La date de révision ne peut pas être dans le passé",
          })}
        />
        <p className="text-xs text-neutral-400">Quand cette décision devrait-elle être réévaluée ? Les décisions en retard apparaissent dans la file de révision.</p>
      </div>

      {/* Owner */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Responsable</span>
          <InfoIcon tooltip="La personne responsable de cette décision — pas nécessairement celle qui l'a prise. Le responsable surveille les résultats et agit à la date de révision." />
        </div>
        <p className="text-sm text-neutral-700 font-medium">{ownerName ?? ownerId}</p>
        <p className="text-xs text-neutral-400">Responsable du suivi de cette décision et de son traitement à la date de révision.</p>
      </div>

      {/* Context */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="context">Contexte</label>
          <InfoIcon tooltip="Décrivez la situation qui a rendu cette décision nécessaire. Quelles contraintes, pressions ou événements y ont conduit ? C'est la photo 'avant' — sans elle, la justification n'aura plus de sens plus tard." />
        </div>
        <Textarea
          id="context"
          placeholder="ex. Notre équipe support est déjà à pleine capacité pendant le cycle d'onboarding Q3. L'intégration Salesforce nécessiterait 3 semaines de mise en place et de formation. Elle était initialement prévue en Q3 mais la disponibilité de l'équipe a changé."
          className="min-h-24"
          {...register("context")}
        />
        <p className="text-xs text-neutral-400">Quelle situation, quelles contraintes ou quels événements ont rendu cette décision nécessaire ?</p>
      </div>

      {/* Rationale */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="rationale">Justification</label>
          <InfoIcon tooltip="Expliquez pourquoi cette option a été choisie plutôt que les alternatives. Quels facteurs ont été déterminants ? Quels compromis ont été acceptés ? C'est le champ le plus important — c'est la raison d'être de Rationale." />
        </div>
        <Textarea
          id="rationale"
          placeholder="ex. Reporter réduit le risque pour l'équipe support pendant une période critique. L'intégration apporte peu de valeur immédiate par rapport au coût de mise en place. Nous avons envisagé un prestataire mais la coordination restait trop lourde. Nous réévaluerons en Q4 quand la capacité s'améliorera."
          className="min-h-32"
          {...register("rationale")}
        />
        <p className="text-xs text-neutral-400">Pourquoi cette option ? Quels compromis ont été acceptés ? Quelles alternatives ont été écartées ?</p>
      </div>

      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Enregistrer la décision" : "Mettre à jour"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
      </div>
    </form>
  );
}
