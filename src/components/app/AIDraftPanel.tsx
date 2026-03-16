"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { generateDecisionDraftAction } from "@/server/actions/ai-draft.actions";
import type { AIDraft } from "@/types";

interface AIDraftPanelProps {
  onDraftReady: (draft: AIDraft) => void;
}

export function AIDraftPanel({ onDraftReady }: AIDraftPanelProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await generateDecisionDraftAction({ notes });
      if (!result.success) {
        setError(result.error);
        return;
      }
      onDraftReady(result.data);
      setOpen(false);
      setNotes("");
    });
  }

  if (!open) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-4 bg-neutral-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-700">Draft from notes</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Paste meeting notes or a Slack summary to generate a draft decision.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Use AI draft
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-800">Draft from notes</p>
        <button
          type="button"
          onClick={() => { setOpen(false); setNotes(""); setError(""); }}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        Paste your raw notes below. The AI will suggest a structured decision draft — you remain in full control before saving.
      </p>
      <form onSubmit={handleGenerate} className="space-y-3">
        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. We discussed migrating to Postgres. Main reasons: better query performance, team familiarity. We ruled out MySQL because of json support..."
          className="min-h-[120px]"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={notes.trim().length < 10 || pending}>
            {pending ? <><Spinner className="w-3.5 h-3.5 mr-1.5" /> Generating…</> : "Generate draft"}
          </Button>
          <p className="text-xs text-neutral-400">AI suggestions will pre-fill the form fields below.</p>
        </div>
      </form>
    </div>
  );
}
