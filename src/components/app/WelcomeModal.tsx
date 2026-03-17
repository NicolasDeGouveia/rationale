"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  show: boolean;
}

export function WelcomeModal({ show }: WelcomeModalProps) {
  const [open, setOpen] = useState(show);

  function dismiss() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">Bienvenue sur Rationale</p>
              <h2 id="welcome-title" className="text-lg font-semibold text-neutral-900 leading-snug">
                Ne perdez plus le pourquoi derrière les décisions de votre équipe.
              </h2>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 text-neutral-300 hover:text-neutral-500 transition-colors mt-0.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-5 space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Rationale est un registre structuré pour les décisions qui comptent — celles qui façonnent votre produit, votre équipe ou votre architecture. Tout n&apos;a pas sa place ici.
          </p>

          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Une bonne décision répond à</p>
            <ul className="space-y-1.5">
              {[
                ["Ce qui a été décidé", "Le choix effectué, pas la tâche assignée"],
                ["Pourquoi", "Le raisonnement, les compromis et les alternatives écartées"],
                ["Qui en est responsable", "La personne chargée de surveiller les résultats"],
                ["Quand réévaluer", "Une date pour vérifier si la décision tient toujours"],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-neutral-200 flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <span className="font-medium text-neutral-800">{label}</span>
                    <span className="text-neutral-500"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Bons candidats : choix d&apos;architecture, orientations produit, décisions de processus, recrutements clés. Pas adapté : tâches individuelles, notes de réunion ou détails d&apos;implémentation.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <Link href="/decisions/new" onClick={dismiss}>
            <Button className="w-full">Créer la première décision</Button>
          </Link>
          <Link href="/decisions/sample" onClick={dismiss}>
            <Button variant="secondary" className="w-full">Voir un exemple de décision</Button>
          </Link>
          <button
            onClick={dismiss}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors py-1"
          >
            Passer pour l&apos;instant
          </button>
        </div>
      </div>
    </div>
  );
}
