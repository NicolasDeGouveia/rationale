import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-neutral-900 py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
          Start building your team&apos;s decision memory
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8 text-base leading-relaxed">
          Free to start. No credit card required. Set up your workspace in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white">
              Get started free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/10">
              View pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
