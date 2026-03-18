const steps = [
  {
    number: "01",
    title: "Capturer",
    description: "Créez une décision manuellement ou générez un brouillon à partir de notes de réunion.",
  },
  {
    number: "02",
    title: "Retrouver",
    description: "Recherchez par sujet, responsable, statut ou date pour retrouver instantanément la justification originale.",
  },
  {
    number: "03",
    title: "Réviser",
    description: "Recevez des rappels quand les hypothèses doivent être réévaluées ou quand une décision devient obsolète.",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Comment ça marche
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Un workflow conçu autour des décisions d&apos;équipe.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            Le produit est conçu autour de trois moments : capturer la décision, retrouver le contexte plus tard, et la réviser avant qu&apos;elle ne devienne obsolète.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
