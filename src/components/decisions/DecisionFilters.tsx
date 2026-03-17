"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DECISION_STATUS_OPTIONS } from "@/lib/constants";

interface DecisionFiltersProps {
  initialStatus?: string[];
  initialOwnerId?: string;
  initialTags?: string[];
  initialReviewDateFrom?: string;
  initialReviewDateTo?: string;
}

export function DecisionFilters({
  initialStatus,
  initialReviewDateFrom,
  initialReviewDateTo,
}: DecisionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [statusFilters, setStatusFilters] = useState<string[]>(initialStatus ?? []);
  const [reviewDateFrom, setReviewDateFrom] = useState(initialReviewDateFrom ?? "");
  const [reviewDateTo, setReviewDateTo] = useState(initialReviewDateTo ?? "");
  const [expanded, setExpanded] = useState(
    (initialStatus?.length ?? 0) > 0 || !!initialReviewDateFrom || !!initialReviewDateTo
  );

  const applyFilters = useCallback(
    (status: string[], from: string, to: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");
      status.forEach((s) => params.append("status", s));
      if (from) params.set("reviewDateFrom", from); else params.delete("reviewDateFrom");
      if (to) params.set("reviewDateTo", to); else params.delete("reviewDateTo");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function toggleStatus(value: string) {
    const next = statusFilters.includes(value)
      ? statusFilters.filter((s) => s !== value)
      : [...statusFilters, value];
    setStatusFilters(next);
    applyFilters(next, reviewDateFrom, reviewDateTo);
  }

  function clearAll() {
    setStatusFilters([]);
    setReviewDateFrom("");
    setReviewDateTo("");
    applyFilters([], "", "");
  }

  const hasFilters = statusFilters.length > 0 || reviewDateFrom || reviewDateTo;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Filtres
        </button>
        {hasFilters && (
          <button type="button" onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 transition-colors">
            Tout effacer
          </button>
        )}
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-neutral-500">Statut</p>
            <div className="flex flex-wrap gap-1.5">
              {DECISION_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleStatus(opt.value)}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-full border transition-colors",
                    statusFilters.includes(opt.value)
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-neutral-500">Date de révision</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={reviewDateFrom}
                onChange={(e) => { setReviewDateFrom(e.target.value); applyFilters(statusFilters, e.target.value, reviewDateTo); }}
                className="text-xs border border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <span className="text-xs text-neutral-400">au</span>
              <input
                type="date"
                value={reviewDateTo}
                onChange={(e) => { setReviewDateTo(e.target.value); applyFilters(statusFilters, reviewDateFrom, e.target.value); }}
                className="text-xs border border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
