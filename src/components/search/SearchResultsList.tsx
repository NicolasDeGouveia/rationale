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
        title={query ? `Aucun résultat pour « ${query} »` : "Aucune décision ne correspond à vos filtres"}
        description="Essayez d'autres mots-clés ou ajustez vos filtres."
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        {total === 1 ? "1 décision" : `${total} décisions`}
        {query ? ` correspondant à « ${query} »` : ""}
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
            <Button variant="secondary" size="sm">Charger plus</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
