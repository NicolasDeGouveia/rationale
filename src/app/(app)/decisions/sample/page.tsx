import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailSection } from "@/components/decisions/DetailSection";

export const metadata = { title: "Sample Decision — Rationale" };

export default function SampleDecisionPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Sample banner */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">
          This is a sample decision — it shows what a complete, well-documented decision record looks like in Rationale.
        </p>
        <Link href="/decisions/new" className="ml-auto shrink-0">
          <Button size="sm">Create your first decision</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="decided">Decided</Badge>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
            Delay Salesforce integration until Q4 when support capacity improves
          </h1>
          <p className="text-base text-neutral-500 mt-2">
            We chose to push the Salesforce integration to Q4 to avoid overloading the support team during the peak onboarding season.
          </p>
        </div>

        {/* Key metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Owner</p>
            <p className="text-sm font-medium text-neutral-900">Sarah Chen</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Status</p>
            <Badge variant="decided">Decided</Badge>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Decided on</p>
            <p className="text-sm text-neutral-700">Sep 12, 2024</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Review date</p>
            <p className="text-sm text-neutral-700">Dec 1, 2024</p>
          </div>
        </div>

        {/* Rationale */}
        <DetailSection title="Rationale">
          <p className="text-base text-neutral-800 leading-relaxed">
            Delaying to Q4 eliminates execution risk during our highest-stakes onboarding period. The integration requires approximately 3 weeks of setup and cross-team coordination — time the support team cannot spare in Q3. The business value of the integration is real but not time-sensitive: Salesforce syncing improves reporting efficiency, it doesn&apos;t unblock any current revenue. We evaluated hiring a contractor to run the project, but the coordination overhead still falls on internal support staff, so the risk profile doesn&apos;t change materially. Q4 gives us a clear window with adequate capacity and no competing priorities.
          </p>
        </DetailSection>

        {/* Context */}
        <DetailSection title="Context">
          <p className="text-sm text-neutral-700 leading-relaxed">
            The Salesforce integration was originally scoped for Q3 to improve CRM data quality and reduce manual reporting. However, Q3 also coincides with our largest annual onboarding cohort — 40% of our yearly new customers onboard between August and October. The support team is already committed to onboarding operations, product training, and a parallel infrastructure migration. Adding a CRM integration project would require their involvement for testing, data mapping, and post-launch issue resolution. The engineering team flagged this dependency in the Q3 planning review.
          </p>
        </DetailSection>

        {/* Alternatives */}
        <DetailSection title="Alternatives considered">
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Proceed with integration in Q3 as planned</span>
                <p className="text-neutral-500 mt-0.5">Risk of overloading support team during onboarding peak. Rejected — the downside is too high given the non-critical nature of the integration.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Hire a contractor to run the integration project</span>
                <p className="text-neutral-500 mt-0.5">Reduces engineering load but support team coordination overhead remains. Estimated cost €8k for 3 weeks. Rejected — cost not justified given delay option exists.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Scope down to read-only Salesforce sync only</span>
                <p className="text-neutral-500 mt-0.5">Would reduce effort significantly but doesn&apos;t address the reporting use case. Deprioritized — partial solution with full coordination cost.</p>
              </div>
            </li>
          </ul>
        </DetailSection>

        {/* Assumptions */}
        <DetailSection title="Assumptions">
          <ul className="space-y-1">
            {[
              "Support team capacity will return to normal levels by November",
              "Salesforce integration requirements will not change materially by Q4",
              "No new customer commitments require Salesforce sync before Q4",
            ].map((a) => (
              <li key={a} className="text-sm text-neutral-700 flex gap-2">
                <span className="text-neutral-300">–</span>{a}
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {["integrations", "support", "q3-planning"].map((tag) => (
            <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-3">
            Ready to document your own decisions? A complete record takes less than 2 minutes.
          </p>
          <Link href="/decisions/new">
            <Button>Create your first decision</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
