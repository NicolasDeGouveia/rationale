const decisionItems = [
  {
    title: "Switch annual pricing for Enterprise",
    summary: "Sales cycles were slowing down because annual pricing was negotiated manually on every deal.",
    status: "Decided",
    owner: "Nina",
    tag: "Pricing",
    decision: "Mar 10",
    review: "Apr 15",
    statusColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    title: "Delay Salesforce integration",
    summary: "Support load and implementation complexity were underestimated in the first evaluation.",
    status: "Reopened",
    owner: "Marc",
    tag: "Product",
    decision: "Feb 21",
    review: "This week",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    title: "Standardize support SLA for Premium",
    summary: "We need clearer expectations for customers and internal escalation paths.",
    status: "Draft",
    owner: "Sarah",
    tag: "Operations",
    decision: "Mar 14",
    review: "Apr 01",
    statusColor: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
];

const reviewItems = [
  { title: "Delay Salesforce integration", summary: "Original assumptions changed after support and implementation feedback.", badge: "Overdue", badgeColor: "bg-red-50 text-red-600 border-red-100" },
  { title: "Switch annual pricing for Enterprise", summary: "Review the impact on conversion and average contract value.", badge: "This week", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  { title: "Standardize support SLA for Premium", summary: "No validation checkpoint has been planned yet.", badge: "No review date", badgeColor: "bg-neutral-100 text-neutral-500 border-neutral-200" },
];

export function AppPreviewSection() {
  return (
    <section id="app" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Application design
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-2xl">
            A calm, structured interface for decision-making teams.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            The app uses a sober B2B visual language: clean cards, clear hierarchy, strong search and an inbox dedicated to decisions that require attention.
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
              {["Dashboard", "Decisions", "Reviews", "Search", "Settings"].map((item) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-sm ${item === "Decisions" ? "bg-neutral-900 text-white font-medium" : "text-neutral-500"}`}
                >
                  {item}
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-neutral-100">
                <div className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Decision health</p>
                  <p className="text-2xl font-extrabold text-neutral-900">82</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Average quality score across current decisions</p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 border-r border-neutral-100">
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Application preview</p>
                  <h3 className="text-xl font-bold text-neutral-900">Decisions</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer text-xs text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg">Filter</button>
                  <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg">New decision</button>
                </div>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
                  <svg className="h-3.5 w-3.5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-neutral-400">Search by title, topic, owner or rationale...</span>
                </div>
                <span className="text-xs text-neutral-400">17 decisions</span>
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
                      <p className="text-xs text-neutral-400">Owner: {d.owner}</p>
                      <p className="text-xs text-neutral-400">Tag: {d.tag}</p>
                      <p className="text-xs text-neutral-400">Decision: {d.decision}</p>
                      <p className="text-xs text-neutral-400">Review: {d.review}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI draft panel */}
              <div className="mx-5 mb-5 mt-3 border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Create decision</p>
                    <p className="text-sm font-bold text-neutral-900">Manual or AI-assisted</p>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">Notes → draft</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-500">Meeting notes</p>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      - Sales reports friction on Enterprise annual pricing{"\n"}- Finance wants standardization{"\n"}- Concern about discounting flexibility{"\n"}- Review impact after one month
                    </p>
                    <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700">Generate draft</button>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-500">Suggested decision</p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-neutral-800">Title: Standardize Enterprise annual pricing</p>
                      <p className="text-xs text-neutral-500">Why: Reduce custom negotiation effort and speed up sales cycles.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-700">Missing: owner and review date</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 rounded-lg px-3 py-1.5">Save draft</button>
                      <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700">Edit</button>
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
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Decision detail</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-100">Decided</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 leading-snug">Switch annual pricing for Enterprise</h4>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Standardize annual pricing for Enterprise to reduce negotiation overhead and create a clearer offer.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Why this decision</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Teams were repeating the same pricing discussions across deals. Standardization improves clarity and saves time.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Owner</p>
                    <p className="text-xs font-semibold text-neutral-900">Nina Patel</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-0.5">Review date</p>
                    <p className="text-xs font-semibold text-amber-700">Apr 15, 2026</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Alternatives</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Quarterly pricing", "Custom pricing"].map((a) => (
                      <span key={a} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review inbox */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Review inbox</p>
                    <p className="text-sm font-bold text-neutral-900">Needs attention</p>
                  </div>
                  <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">See all</button>
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
                        <button className="cursor-pointer text-xs font-medium text-white bg-neutral-900 rounded-lg px-2.5 py-1">Review now</button>
                        <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">Reschedule</button>
                        <button className="cursor-pointer text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-600">Reopen</button>
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
