import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <div className="px-4 pt-4">
      <header className="mx-auto max-w-6xl bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">DM</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 leading-none">Decision Memory</p>
              <p className="text-xs text-neutral-400 mt-0.5">Capture. Retrieve. Review.</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-500">
            <Link href="#product" className="hover:text-neutral-900 transition-colors">Product</Link>
            <Link href="#workflow" className="hover:text-neutral-900 transition-colors">Workflow</Link>
            <Link href="#app" className="hover:text-neutral-900 transition-colors">App</Link>
            <Link href="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1.5">
              See demo
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-700">Join beta</Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
