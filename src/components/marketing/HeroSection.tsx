import Link from "next/link";
import { Button } from "@/components/ui/button";

function HeroDecisionCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden w-full">
      {/* Search bar at top */}
      <div className="border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5">
          <svg className="h-3.5 w-3.5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs text-neutral-400">Rechercher des décisions</span>
        </div>
        <span className="text-xs text-neutral-400 shrink-0">tarification entreprise plan annuel</span>
      </div>

      <div className="flex gap-0 divide-x divide-neutral-100">
        {/* Decision card */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fiche décision</p>
            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">Décidé</span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 leading-snug">
            Passer à la tarification annuelle pour l&apos;Enterprise
          </h3>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Pourquoi cette décision</p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Les cycles de vente ralentissaient car la tarification annuelle était négociée manuellement sur chaque deal. Standardiser l&apos;offre réduit la friction et donne aux commerciaux un discours plus clair.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Alternatives envisagées</p>
            <div className="flex flex-wrap gap-1.5">
              {["Garder le pricing custom", "Tarification trimestrielle", "Pilote sur un segment"].map((a) => (
                <span key={a} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">{a}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-neutral-50 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Hypothèse</p>
              <p className="text-xs text-neutral-600">Les acheteurs Enterprise préfèrent des parcours d&apos;achat simplifiés.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Date de révision</p>
              <p className="text-xs font-semibold text-amber-700">15 avr. 2026</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-52 shrink-0 p-4 space-y-4">
          <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Responsable</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-indigo-700">N</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">Nina Patel</p>
                <p className="text-xs text-neutral-400">Head of Product</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Chronologie</p>
            <ul className="space-y-2">
              {[
                "Problème identifié",
                "Alternatives discutées",
                "Décision validée",
                "Révision planifiée",
              ].map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-neutral-900 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-neutral-800">{step}</p>
                    <p className="text-xs text-neutral-400">Contexte préservé pour consultation ultérieure</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="pt-16 pb-24">
      <div className="mx-auto max-w-6xl px-6 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 shrink-0">
          <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-6">
            Décisions d&apos;équipe sans perte de contexte
          </span>
          <h1 className="text-5xl font-extrabold text-neutral-900 leading-tight tracking-tight mb-6">
            Ne perdez plus le{" "}
            <span className="text-indigo-600">pourquoi</span>{" "}
            derrière les décisions de votre équipe.
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8">
            Rationale transforme vos notes de réunion, messages Slack et docs épars en décisions structurées que votre équipe peut retrouver, comprendre et réviser plus tard.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link href="/signup">
              <Button size="lg" className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 px-6">
                Demander une démo
              </Button>
            </Link>
            <Link href="#app">
              <Button size="lg" variant="secondary" className="rounded-xl px-6">
                Voir un exemple de décision
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            {[
              { value: "2 min", label: "pour créer une décision" },
              { value: "20 sec", label: "pour retrouver le contexte" },
              { value: "1 inbox", label: "pour toutes les révisions" },
            ].map((stat) => (
              <div key={stat.value} className="flex-1 bg-white rounded-xl border border-neutral-200 px-3 py-3">
                <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 min-w-0">
          <HeroDecisionCard />
        </div>
      </div>
    </section>
  );
}
