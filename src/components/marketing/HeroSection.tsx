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
          <span className="text-xs text-neutral-400">Search decisions</span>
        </div>
        <span className="text-xs text-neutral-400 shrink-0">pricing enterprise annual plan</span>
      </div>

      <div className="flex gap-0 divide-x divide-neutral-100">
        {/* Decision card */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Decision card</p>
            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">Decided</span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 leading-snug">
            Switch annual pricing for Enterprise
          </h3>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Why this decision</p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Sales cycles were slowing down because annual pricing was negotiated manually on every deal. Standardizing the offer reduces friction and gives sales a clearer narrative.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Alternatives considered</p>
            <div className="flex flex-wrap gap-1.5">
              {["Keep custom pricing", "Quarterly pricing", "Pilot with one segment"].map((a) => (
                <span key={a} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">{a}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-neutral-50 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Assumption</p>
              <p className="text-xs text-neutral-600">Enterprise buyers prefer simpler procurement paths.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Review date</p>
              <p className="text-xs font-semibold text-amber-700">Apr 15, 2026</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-52 shrink-0 p-4 space-y-4">
          <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Owner</p>
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
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Decision timeline</p>
            <ul className="space-y-2">
              {[
                "Problem identified",
                "Alternatives discussed",
                "Decision validated",
                "Review scheduled",
              ].map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-neutral-900 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-neutral-800">{step}</p>
                    <p className="text-xs text-neutral-400">Context preserved for later retrieval</p>
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
            Team decisions without context loss
          </span>
          <h1 className="text-5xl font-extrabold text-neutral-900 leading-tight tracking-tight mb-6">
            Don&apos;t lose the{" "}
            <span className="text-indigo-600">why</span>{" "}
            behind your team&apos;s decisions.
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8">
            Decision Memory turns scattered meeting notes, Slack messages and docs into structured decisions your team can find, understand and review later.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link href="/signup">
              <Button size="lg" className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 px-6">
                Request a demo
              </Button>
            </Link>
            <Link href="#app">
              <Button size="lg" variant="secondary" className="rounded-xl px-6">
                View example decision
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            {[
              { value: "2 min", label: "to create a decision" },
              { value: "20 sec", label: "to retrieve context" },
              { value: "1 inbox", label: "for all reviews due" },
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
