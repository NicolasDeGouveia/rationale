import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function DecisionCardMockup() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-xl p-6 max-w-sm w-full text-left">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">Decided</span>
        <span className="text-xs text-neutral-400">Mar 2026</span>
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 mb-2">
        Adopt Next.js App Router as the primary rendering layer
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Rationale</p>
          <p className="text-xs text-neutral-700 leading-relaxed">
            App Router provides server-side data fetching collocated with components, reducing client
            bundle size and simplifying data flow across the product.
          </p>
        </div>
        <div className="flex items-center gap-4 pt-1 border-t border-neutral-100">
          <div>
            <p className="text-xs text-neutral-400">Owner</p>
            <p className="text-xs font-medium text-neutral-700">Sarah K.</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Review</p>
            <p className="text-xs font-medium text-amber-600">Jun 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 max-w-xl">
          <Badge variant="default" className="mb-6">Decision memory for teams</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight mb-5">
            Don&apos;t lose the <em className="not-italic text-blue-600">why</em> behind your team&apos;s decisions.
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8">
            Rationale captures what was decided, why, who owns it, and when to review it —
            so your team never repeats the same debate twice.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup">
              <Button size="lg">Start for free</Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="secondary">See an example</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <DecisionCardMockup />
        </div>
      </div>
    </section>
  );
}
