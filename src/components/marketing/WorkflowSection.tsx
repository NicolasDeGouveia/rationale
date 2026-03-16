const steps = [
  {
    number: "01",
    title: "Capture",
    description:
      "Create a structured decision record with title, rationale, context, owner, and review date. Or paste meeting notes and let AI draft it for you to review.",
  },
  {
    number: "02",
    title: "Retrieve",
    description:
      "Search your team's full decision history in seconds. Find the rationale behind any choice without digging through Slack or old docs.",
  },
  {
    number: "03",
    title: "Review",
    description:
      "Get notified when a decision needs revisiting. Reopen, update, or archive decisions as context changes — so your records stay trustworthy.",
  },
];

export function WorkflowSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            A simple loop your team will actually use
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <span className="text-3xl font-bold text-neutral-200">{step.number}</span>
              <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
