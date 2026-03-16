function DecisionListMockup() {
  const items = [
    { title: "Adopt Next.js App Router", status: "Decided", owner: "Sarah K.", review: "Jun 2026", urgency: null },
    { title: "Use PostgreSQL as primary DB", status: "Decided", owner: "Alex M.", review: "Apr 2026", urgency: "due_soon" },
    { title: "Migrate to Stripe Billing", status: "Reopened", owner: "Tom R.", review: "Mar 2026", urgency: "overdue" },
    { title: "Define API versioning strategy", status: "Draft", owner: "Lena P.", review: null, urgency: "missing" },
  ];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
      <div className="border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-neutral-200" />
          <div className="h-3 w-3 rounded-full bg-neutral-200" />
          <div className="h-3 w-3 rounded-full bg-neutral-200" />
        </div>
        <span className="text-xs text-neutral-400 font-medium">Decisions</span>
      </div>
      <div className="divide-y divide-neutral-100">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-900 truncate">{item.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.owner}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.status === "Decided" ? "bg-blue-50 text-blue-700" :
                item.status === "Reopened" ? "bg-amber-50 text-amber-700" :
                "bg-neutral-100 text-neutral-500"
              }`}>{item.status}</span>
              {item.urgency === "overdue" && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>}
              {item.urgency === "due_soon" && <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Due soon</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppPreviewSection() {
  return (
    <section id="demo" className="bg-neutral-50 border-y border-neutral-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Built for teams that care about context
          </h2>
          <p className="mt-3 text-neutral-500 max-w-lg mx-auto">
            A calm, structured interface designed around decisions — not notes, not tasks, not wikis.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <DecisionListMockup />
        </div>
      </div>
    </section>
  );
}
