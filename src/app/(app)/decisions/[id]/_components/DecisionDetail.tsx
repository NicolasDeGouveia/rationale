import { StatusBadge } from "@/components/app/StatusBadge";
import { ReviewUrgencyBadge } from "@/components/app/ReviewUrgencyBadge";
import { formatDate } from "@/lib/utils";
import type { DecisionDetail as DecisionDetailType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DecisionDetailProps {
  decision: DecisionDetailType;
  canEdit: boolean;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{title}</p>
      <div>{children}</div>
    </div>
  );
}

export function DecisionDetail({ decision, canEdit }: DecisionDetailProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={decision.status} />
            {decision.reviewUrgency && (
              <ReviewUrgencyBadge urgency={decision.reviewUrgency} />
            )}
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">{decision.title}</h1>
          {decision.summary && (
            <p className="text-base text-neutral-500 mt-2">{decision.summary}</p>
          )}
        </div>
        {canEdit && (
          <Link href={`/decisions/${decision.id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
        )}
      </div>

      {/* Key metadata — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div>
          <p className="text-xs text-neutral-400 mb-0.5">Owner</p>
          <p className="text-sm font-medium text-neutral-900">{decision.owner.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400 mb-0.5">Status</p>
          <StatusBadge status={decision.status} />
        </div>
        <div>
          <p className="text-xs text-neutral-400 mb-0.5">Decided on</p>
          <p className="text-sm text-neutral-700">{formatDate(decision.decisionDate)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400 mb-0.5">Review date</p>
          <p className="text-sm text-neutral-700">{formatDate(decision.reviewDate)}</p>
        </div>
      </div>

      {/* Rationale — most prominent section */}
      {decision.rationale && (
        <Section title="Rationale">
          <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-wrap">{decision.rationale}</p>
        </Section>
      )}

      {decision.context && (
        <Section title="Context">
          <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{decision.context}</p>
        </Section>
      )}

      {decision.alternatives.length > 0 && (
        <Section title="Alternatives considered">
          <ul className="space-y-2">
            {decision.alternatives.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-sm">
                <span className="text-neutral-400 mt-0.5">→</span>
                <div>
                  <span className="font-medium text-neutral-800">{a.title}</span>
                  {a.description && <p className="text-neutral-500 mt-0.5">{a.description}</p>}
                  {a.rejected && <span className="ml-2 text-xs text-neutral-400">(rejected)</span>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {decision.assumptions.length > 0 && (
        <Section title="Assumptions">
          <ul className="space-y-1">
            {decision.assumptions.map((a) => (
              <li key={a.id} className="text-sm text-neutral-700 flex gap-2">
                <span className="text-neutral-300">–</span>{a.content}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {decision.risks.length > 0 && (
        <Section title="Risks">
          <ul className="space-y-1">
            {decision.risks.map((r) => (
              <li key={r.id} className="text-sm text-neutral-700 flex gap-2">
                <span className="text-neutral-300">–</span>{r.content}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {decision.links.length > 0 && (
        <Section title="Related links">
          <ul className="space-y-1">
            {decision.links.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {l.label ?? l.url}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {decision.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {decision.tags.map((tag) => (
            <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
