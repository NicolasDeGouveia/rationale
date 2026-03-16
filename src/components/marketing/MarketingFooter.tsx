import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-200/60">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{APP_NAME}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{APP_TAGLINE}</p>
        </div>
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
