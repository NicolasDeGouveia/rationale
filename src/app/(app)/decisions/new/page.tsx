import { getAuthContext } from "@/server/auth-context";
import { DecisionForm } from "@/components/decisions/DecisionForm";

export const metadata = { title: "Nouvelle décision — Rationale" };

export default async function NewDecisionPage() {
  const { user } = await getAuthContext();
  const aiEnabled = process.env.ANTHROPIC_API_KEY !== undefined && process.env.ANTHROPIC_API_KEY !== "";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Nouvelle décision</h1>
        <p className="text-sm text-neutral-500 mt-1">Capturez ce qui a été décidé et pourquoi.</p>
      </div>
      <DecisionForm mode="create" ownerId={user.id} ownerName={user.name} aiEnabled={aiEnabled} />
    </div>
  );
}
