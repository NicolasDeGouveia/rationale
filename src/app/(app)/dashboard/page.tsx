import Link from "next/link";
import { getAuthContext } from "@/server/auth-context";
import { getDecisionsByWorkspace, getDashboardStats, getRecentActivity } from "@/server/data-access/decisions";
import { getReviewInbox } from "@/server/services/review.service";
import { StatusBadge } from "@/components/decisions/StatusBadge";
import { ReviewUrgencyBadge } from "@/components/review/ReviewUrgencyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WelcomeModal } from "@/components/app/WelcomeModal";
import { formatDate, cn } from "@/lib/utils";
import { DECISION_STATUS_LABELS, ACTIVITY_ACTION_LABELS } from "@/lib/constants";

export const metadata = { title: "Tableau de bord — Rationale" };

export default async function DashboardPage() {
  const { user, membership } = await getAuthContext();
  const workspaceId = membership.workspaceId;

  const [decisions, stats, reviewItems, activity] = await Promise.all([
    getDecisionsByWorkspace(workspaceId),
    getDashboardStats(workspaceId),
    getReviewInbox(workspaceId),
    getRecentActivity(workspaceId, 8),
  ]);

  const recent = decisions.slice(0, 5);
  const attentionItems = reviewItems.slice(0, 4);

  const hasDecisions = decisions.length > 0;
  const attentionCount = stats.overdueCount + stats.dueSoonCount + stats.missingReviewCount + stats.reopenedCount;

  return (
    <div className="min-h-full bg-slate-50">
      <WelcomeModal show={!hasDecisions} />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{membership.workspace.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Bon retour, {user.name ?? user.email}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/search">
              <Button variant="secondary" size="sm">Rechercher</Button>
            </Link>
            <Link href="/decisions/new">
              <Button size="sm">Nouvelle décision</Button>
            </Link>
          </div>
        </div>

        {!hasDecisions ? (
          /* Empty state */
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">La mémoire de vos décisions commence ici</h2>
            <p className="text-sm text-slate-500 mb-2 max-w-sm mx-auto">
              Capturez une décision récente de votre équipe — ce qui a été décidé, pourquoi, qui en est responsable, et quand la réévaluer.
            </p>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
              Tout n&apos;a pas sa place ici. Rationale est fait pour les décisions qui comptent : choix d&apos;architecture, orientations produit, changements de processus, décisions de recrutement.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link href="/decisions/new">
                <Button>Créer la première décision</Button>
              </Link>
              <Link href="/decisions/sample" className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2">
                Voir à quoi ressemble une bonne décision
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Needs attention */}
            {attentionCount > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      {attentionCount > 9 ? "9+" : attentionCount}
                    </span>
                    Nécessite votre attention
                  </h2>
                  {reviewItems.length > 4 && (
                    <Link href="/review" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                      Voir tout ({reviewItems.length}) →
                    </Link>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  {attentionItems.map((item, i) => (
                    <Link
                      key={item.decision.id}
                      href={`/decisions/${item.decision.id}`}
                      className={cn(
                        "flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group",
                        i < attentionItems.length - 1 && "border-b border-slate-100"
                      )}
                    >
                      <div className="shrink-0">
                        <ReviewUrgencyBadge urgency={item.urgency} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-slate-700">
                          {item.decision.title}
                        </p>
                        {item.decision.summary && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">{item.decision.summary}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-xs text-slate-500">{item.decision.owner.name ?? "—"}</p>
                        {item.decision.reviewDate && (
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(item.decision.reviewDate)}</p>
                        )}
                      </div>
                      <svg className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Recent decisions — spans 2 cols */}
              <section className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Décisions récentes</h2>
                  <Link href="/decisions" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                    Voir tout ({decisions.length}) →
                  </Link>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  {recent.map((d, i) => (
                    <Link
                      key={d.id}
                      href={`/decisions/${d.id}`}
                      className={cn(
                        "flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group",
                        i < recent.length - 1 && "border-b border-slate-100"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={d.status} />
                          {d.reviewUrgency && <ReviewUrgencyBadge urgency={d.reviewUrgency} />}
                        </div>
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-slate-700">
                          {d.title}
                        </p>
                        {d.summary && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{d.summary}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-xs text-slate-500">{d.owner.name ?? "—"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(d.updatedAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Right column */}
              <div className="space-y-4">

                {/* Status distribution */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">Par statut</h2>
                  <div className="space-y-2.5">
                    {(["DECIDED", "DRAFT", "REOPENED", "ARCHIVED"] as const).map((status) => {
                      const count = stats.byStatus[status] ?? 0;
                      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      const barColor: Record<string, string> = {
                        DECIDED: "bg-blue-400",
                        DRAFT: "bg-slate-300",
                        REOPENED: "bg-amber-400",
                        ARCHIVED: "bg-slate-200",
                      };
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">{DECISION_STATUS_LABELS[status]}</span>
                            <span className="text-xs font-medium text-slate-700">{count}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", barColor[status])}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      {stats.total} décision{stats.total !== 1 ? "s" : ""} au total
                    </p>
                  </div>
                </div>

                {/* Health metrics */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">Santé des décisions</h2>
                  <div className="space-y-3">
                    <HealthMetric label="Ont un responsable" value={stats.withOwnerPct} />
                    <HealthMetric label="Ont une date de révision" value={stats.withReviewDatePct} />
                    <HealthMetric label="Ont une justification" value={stats.withRationalePct} />
                    <HealthMetric label="En retard (actives)" value={100 - stats.overduePct} invert />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom row: Search + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Search entry */}
              <div className="lg:col-span-1">
                <Link href="/search" className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">Rechercher des décisions</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Retrouvez n&apos;importe quelle décision par titre, justification, contexte ou tags.
                  </p>
                  <div className="mt-4 flex items-center text-xs text-slate-400 gap-1 group-hover:text-slate-600 transition-colors">
                    <span>Ouvrir la recherche</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Activity feed */}
              <div className="lg:col-span-2">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Activité récente</h2>
                {activity.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
                    Aucune activité pour le moment
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    {activity.map((entry, i) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-start gap-3 px-5 py-3",
                          i < activity.length - 1 && "border-b border-slate-100"
                        )}
                      >
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-slate-500">
                            {(entry.actor.name ?? "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-medium text-slate-800">{entry.actor.name ?? "Someone"}</span>
                            {" "}{ACTIVITY_ACTION_LABELS[entry.action] ?? entry.action.toLowerCase().replace(/_/g, " ")}{" "}
                            <Link
                              href={`/decisions/${entry.decisionId}`}
                              className="font-medium text-slate-800 hover:text-slate-900 underline underline-offset-2 decoration-slate-300 hover:decoration-slate-600 transition-colors"
                            >
                              {entry.decisionTitle}
                            </Link>
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 mt-0.5">{formatDate(entry.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthMetric({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value;
  const color = display >= 80 ? "text-green-600" : display >= 50 ? "text-amber-600" : "text-red-600";
  const barColor = display >= 80 ? "bg-green-400" : display >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className={cn("text-xs font-semibold tabular-nums", color)}>{display}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${display}%` }} />
      </div>
    </div>
  );
}
