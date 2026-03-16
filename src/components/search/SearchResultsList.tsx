import { DecisionCard } from "@/components/decisions/DecisionCard";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DecisionSummary } from "@/types";

interface SearchResultsListProps {
  decisions: DecisionSummary[];
  total: number;
  query?: string;
  page: number;
}

export function SearchResultsList({ decisions, total, query, page }: SearchResultsListProps) {
  if (decisions.length === 0) {
    return (
      <EmptyState
        title={query ? `No results for "${query}"` : "No decisions match your filters"}
        description="Try different keywords or adjust your filters."
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        {total === 1 ? "1 decision" : `${total} decisions`}
        {query ? ` matching "${query}"` : ""}
        {page > 1 ? ` — page ${page}` : ""}
      </p>
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        {decisions.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
      {total > decisions.length && (
        <div className="flex justify-center pt-2">
          <Link href={`?page=${page + 1}`}>
            <Button variant="secondary" size="sm">Load more</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
