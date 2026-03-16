import { getAuthContext } from "@/server/auth-context";
import { searchDecisions } from "@/server/data-access/decisions";
import { SearchBar } from "@/components/app/SearchBar";
import { SearchResultsList } from "@/components/app/SearchResultsList";
import { DecisionFilters } from "@/components/app/DecisionFilters";

export const metadata = { title: "Search — Rationale" };

interface Props {
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
    ownerId?: string;
    tags?: string | string[];
    reviewDateFrom?: string;
    reviewDateTo?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { membership } = await getAuthContext();

  const query = sp.q?.trim();
  const status = sp.status ? (Array.isArray(sp.status) ? sp.status : [sp.status]) : undefined;
  const tags = sp.tags ? (Array.isArray(sp.tags) ? sp.tags : [sp.tags]) : undefined;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  const { decisions, total } = await searchDecisions({
    workspaceId: membership.workspaceId,
    query,
    status,
    ownerId: sp.ownerId,
    tags,
    reviewDateFrom: sp.reviewDateFrom,
    reviewDateTo: sp.reviewDateTo,
    page,
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Search</h1>
        <p className="text-sm text-neutral-500 mt-1">Find past decisions by keyword, status, or tag.</p>
      </div>
      <div className="space-y-4">
        <SearchBar initialQuery={query ?? ""} />
        <DecisionFilters
          initialStatus={status}
          initialOwnerId={sp.ownerId}
          initialTags={tags}
          initialReviewDateFrom={sp.reviewDateFrom}
          initialReviewDateTo={sp.reviewDateTo}
        />
        <SearchResultsList decisions={decisions} total={total} query={query} page={page} />
      </div>
    </div>
  );
}
