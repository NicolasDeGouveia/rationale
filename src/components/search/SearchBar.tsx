"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [query, router, pathname, searchParams]
  );

  const handleNavigate = useCallback(() => {
    if (!pathname.startsWith("/search")) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, router, pathname]);

  if (!pathname.startsWith("/search")) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleNavigate(); }} className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
          placeholder="Rechercher des décisions..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-colors"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher par titre, justification, contexte..."
        autoFocus
        className="w-full pl-9 pr-20 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded hover:bg-neutral-700 transition-colors"
      >
        Rechercher
      </button>
    </form>
  );
}
