const beforeItems = [
  "Slack thread with 27 replies",
  "Meeting notes in Notion",
  "Follow-up in email",
  "Decision hidden in a comment",
];

export function BeforeAfterSection() {
  return (
    <section id="product" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            From chaos to clarity
          </span>
          <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-2xl">
            Turn scattered context into one structured decision.
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl text-base leading-relaxed">
            Decision Memory is not another note-taking tool. It transforms fragments from meetings, docs and chat into a searchable, reviewable decision layer for your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-neutral-900">Before</p>
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">Context is scattered</span>
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
              <p className="text-base font-bold text-neutral-900">After</p>
              <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">One decision card</span>
            </div>
            <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Delay Salesforce integration</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Owner: Marc · Review in 7 days</p>
                </div>
                <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full shrink-0">Reopened</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Why</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Implementation complexity was higher than expected.</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Risk</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">Support team would become a bottleneck.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
