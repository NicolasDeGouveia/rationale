import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
        <Link href="/" className="text-sm font-semibold text-neutral-900 tracking-tight">
          {APP_NAME}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
          <Link href="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
