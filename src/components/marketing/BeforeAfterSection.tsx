export function BeforeAfterSection() {
  return (
    <section className="bg-neutral-50 py-20 border-y border-neutral-200">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            From scattered context to structured memory
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
            Most decisions live in Slack threads, meeting notes, and docs that no one can find later.
            Rationale gives them a permanent home.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-6">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-4">Before</p>
            <div className="space-y-3">
              {[
                { source: "Slack", text: "\"I think we went with Postgres but not sure why\"" },
                { source: "Email", text: "\"Re: Re: Re: tech stack decision — see attached\"" },
                { source: "Meeting notes", text: "\"Action: confirm DB choice (owner: ???)\"" },
                { source: "Notion", text: "Page last edited 8 months ago, no rationale" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-red-100 bg-white p-3">
                  <span className="text-xs font-medium text-neutral-400 w-20 shrink-0">{item.source}</span>
                  <p className="text-xs text-neutral-600 italic">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* After */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-6">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-4">After Rationale</p>
            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">Decided</span>
                <span className="text-xs text-neutral-400">Oct 2025</span>
              </div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3">Use PostgreSQL as primary database</h4>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Rationale</p>
                  <p className="text-xs text-neutral-700">Strong consistency, ACID guarantees, and mature ecosystem. Team already has PostgreSQL expertise.</p>
                </div>
                <div className="flex gap-6 pt-2 border-t border-neutral-100">
                  <div><p className="text-xs text-neutral-400">Owner</p><p className="text-xs font-medium text-neutral-700">Alex M.</p></div>
                  <div><p className="text-xs text-neutral-400">Review</p><p className="text-xs font-medium text-neutral-700">Apr 2026</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
