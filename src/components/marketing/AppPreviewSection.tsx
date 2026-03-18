const decisionItems = [
  {
    title: "Passer à la tarification annuelle pour l'Enterprise",
    summary: "Les cycles de vente ralentissaient car la tarification annuelle était négociée manuellement sur chaque deal.",
    status: "Décidé",
    owner: "Nina",
    tag: "Tarification",
    decision: "10 mars",
    review: "15 avr.",
    statusColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    title: "Reporter l'intégration Salesforce",
    summary: "La charge support et la complexité d'implémentation ont été sous-estimées lors de la première évaluation.",
    status: "Rouvert",
    owner: "Marc",
    tag: "Produit",
    decision: "21 fév.",
    review: "Cette semaine",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    title: "Standardiser le SLA support pour Premium",
    summary: "Nous avons besoin d'attentes plus claires pour les clients et de parcours d'escalade internes.",
    status: "Brouillon",
    owner: "Sarah",
    tag: "Opérations",
    decision: "14 mars",
    review: "1 avr.",
    statusColor: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
];

const reviewItems = [
  { title: "Reporter l'intégration Salesforce", summary: "Les hypothèses initiales ont changé suite aux retours du support et de l'implémentation.", badge: "En retard", badgeColor: "bg-red-50 text-red-600 border-red-100" },
  { title: "Passer à la tarification annuelle Enterprise", summary: "Évaluer l'impact sur la conversion et la valeur moyenne des contrats.", badge: "Cette semaine", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  { title: "Standardiser le SLA support Premium", summary: "Aucun point de validation n'a encore été planifié.", badge: "Pas de date", badgeColor: "bg-neutral-100 text-neutral-500 border-neutral-200" },
];

export function AppPreviewSection() {
  return (
    <section id="app" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Aperçu de l&apos;application
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-2xl">
            Une interface calme et structurée pour les équipes qui décident.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            L&apos;app adopte un langage visuel B2B sobre : cartes épurées, hiérarchie claire, recherche puissante et une inbox dédiée aux décisions qui nécessitent une attention.
          </p>
        </div>

        {/* App shell mockup */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
          <div className="flex h-full" style={{ minHeight: "520px" }}>

            {/* Sidebar */}
            <div className="w-48 shrink-0 border-r border-neutral-100 bg-white p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2.5 mb-5 px-1">
                <div className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">DM</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 leading-none">Decision Memory</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Acme Workspace</p>
                </div>
              </div>
              {["Tableau de bord", "Décisions", "Révisions", "Recherche", "Paramètres"].map((item) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-sm ${item === "Décisions" ? "bg-neutral-900 text-white font-medium" : "text-neutral-500"}`}
                >
                  {item}
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-neutral-100">
                <div className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Santé des décisions</p>
                  <p className="text-2xl font-extrabold text-neutral-900">82</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Score qualité moyen sur les décisions actives</p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 border-r border-neutral-100">
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Aperçu de l&apos;application</p>
                  <h3 className="text-xl font-bold text-neutral-900">Décisions</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer text-xs text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg">Filtrer</button>
                  <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg">Nouvelle décision</button>
                </div>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
                  <svg className="h-3.5 w-3.5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-neutral-400">Rechercher par titre, sujet, responsable ou justification...</span>
                </div>
                <span className="text-xs text-neutral-400">17 décisions</span>
              </div>

              {/* Decision list */}
              <div className="divide-y divide-neutral-100">
                {decisionItems.map((d) => (
                  <div key={d.title} className="px-5 py-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-neutral-900">{d.title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${d.statusColor}`}>{d.status}</span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1">{d.summary}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-xs text-neutral-400">Responsable : {d.owner}</p>
                      <p className="text-xs text-neutral-400">Tag : {d.tag}</p>
                      <p className="text-xs text-neutral-400">Décision : {d.decision}</p>
                      <p className="text-xs text-neutral-400">Révision : {d.review}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI draft panel */}
              <div className="mx-5 mb-5 mt-3 border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Créer une décision</p>
                    <p className="text-sm font-bold text-neutral-900">Manuel ou assisté par IA</p>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">Notes → brouillon</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-500">Notes de réunion</p>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      - Les commerciaux signalent des frictions sur la tarification annuelle Enterprise{"\n"}- La finance veut standardiser{"\n"}- Inquiétude sur la flexibilité des remises{"\n"}- Évaluer l&apos;impact après un mois
                    </p>
                    <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700">Générer un brouillon</button>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-500">Décision suggérée</p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-neutral-800">Titre : Standardiser la tarification annuelle Enterprise</p>
                      <p className="text-xs text-neutral-500">Pourquoi : Réduire les négociations custom et accélérer les cycles de vente.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-700">Manquant : responsable et date de révision</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 rounded-lg px-3 py-1.5">Sauvegarder</button>
                      <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700">Modifier</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="w-72 shrink-0 overflow-y-auto">
              {/* Decision detail */}
              <div className="p-4 border-b border-neutral-100 space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Détail de la décision</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-100">Décidé</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 leading-snug">Passer à la tarification annuelle pour l&apos;Enterprise</h4>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Résumé</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Standardiser la tarification annuelle Enterprise pour réduire la charge de négociation et créer une offre plus claire.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Pourquoi cette décision</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Les équipes répétaient les mêmes discussions tarifaires sur chaque deal. La standardisation améliore la clarté et fait gagner du temps.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Responsable</p>
                    <p className="text-xs font-semibold text-neutral-900">Nina Patel</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-0.5">Date de révision</p>
                    <p className="text-xs font-semibold text-amber-700">15 avr. 2026</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Alternatives</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Tarification trimestrielle", "Pricing custom"].map((a) => (
                      <span key={a} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review inbox */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">File de révision</p>
                    <p className="text-sm font-bold text-neutral-900">Nécessite attention</p>
                  </div>
                  <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">Voir tout</button>
                </div>
                <div className="space-y-2">
                  {reviewItems.map((item) => (
                    <div key={item.title} className="border border-neutral-200 rounded-xl p-3 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-neutral-900 leading-snug">{item.title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${item.badgeColor}`}>{item.badge}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{item.summary}</p>
                      <div className="flex gap-1.5">
                        <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 rounded-lg px-2.5 py-1">Réviser</button>
                        <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">Reporter</button>
                        <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">Rouvrir</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
