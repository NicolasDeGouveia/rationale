const steps = [
  {
    number: "01",
    title: "Capture",
    description: "Create a decision manually or generate a draft from meeting notes.",
  },
  {
    number: "02",
    title: "Retrieve",
    description: "Search by topic, owner, status or date to instantly recover the original rationale.",
  },
  {
    number: "03",
    title: "Review",
    description: "Get reminders when assumptions should be revisited or decisions become stale.",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            How it works
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            A workflow built around team decisions.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            The product is designed around three moments: capture the decision, retrieve the context later, and review it before it becomes outdated.
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
