"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { generateDecisionDraftAction } from "@/server/actions/ai-draft.actions";
import type { AIDraft, AIDraftFormFields } from "@/types";

interface AIDraftPanelProps {
  onDraftReady: (draft: AIDraft) => void;
}

export function AIDraftPanel({ onDraftReady }: AIDraftPanelProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<AIDraftFormFields>({ defaultValues: { notes: "" } });

  const notes = watch("notes");

  function onSubmit({ notes }: AIDraftFormFields) {
    startTransition(async () => {
      const result = await generateDecisionDraftAction({ notes });
      if (!result.success) {
        setError("root", { message: result.error });
        return;
      }
      onDraftReady(result.data);
      setOpen(false);
      reset();
    });
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  if (!open) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-4 bg-neutral-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-700">Rédiger à partir de notes</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Collez des notes de réunion ou un résumé Slack pour générer un brouillon de décision.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Utiliser l&apos;IA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-800">Rédiger à partir de notes</p>
        <button
          type="button"
          onClick={handleClose}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Annuler
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        Collez vos notes brutes ci-dessous. L&apos;IA suggérera un brouillon structuré — vous gardez le contrôle total avant d&apos;enregistrer.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Textarea
          label="Notes"
          placeholder="ex. Nous avons discuté de la migration vers Postgres. Principales raisons : meilleures performances des requêtes, familiarité de l'équipe. Nous avons écarté MySQL pour le support JSON..."
          className="min-h-32"
          error={errors.root?.message}
          {...register("notes", { minLength: { value: 10, message: "Les notes doivent faire au moins 10 caractères" } })}
        />
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={!notes || notes.trim().length < 10 || pending}>
            {pending ? <><Spinner className="w-3.5 h-3.5 mr-1.5" /> Génération…</> : "Générer le brouillon"}
          </Button>
          <p className="text-xs text-neutral-400">Les suggestions de l&apos;IA pré-rempliront les champs du formulaire ci-dessous.</p>
        </div>
      </form>
    </div>
  );
}
