const beforeItems = [
  "Thread Slack avec 27 réponses",
  "Notes de réunion dans Notion",
  "Suivi par email",
  "Décision enfouie dans un commentaire",
];

export function BeforeAfterSection() {
  return (
    <section id="product" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Du chaos à la clarté
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-2xl">
            Transformez un contexte épars en une décision structurée.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            Rationale n&apos;est pas un autre outil de prise de notes. Il transforme les fragments de réunions, docs et discussions en une couche de décisions consultable et révisable pour votre équipe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-neutral-900">Avant</p>
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">Le contexte est épars</span>
            </div>
            <div className="space-y-2.5">
              {beforeItems.map((item) => (
                <div key={item} className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-neutral-500">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-neutral-900">Après</p>
              <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">Une fiche décision</span>
            </div>
            <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Reporter l&apos;intégration Salesforce</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Responsable : Marc · Révision dans 7 jours</p>
                </div>
                <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full shrink-0">Rouvert</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Pourquoi</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">La complexité d&apos;implémentation était plus élevée que prévu.</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Risque</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">L&apos;équipe support deviendrait un goulot d&apos;étranglement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
