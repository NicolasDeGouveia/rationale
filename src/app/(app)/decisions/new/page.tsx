import { getAuthContext } from "@/server/auth-context";
import { DecisionForm } from "../[id]/_components/DecisionForm";

export const metadata = { title: "New Decision — Rationale" };

export default async function NewDecisionPage() {
  const { user } = await getAuthContext();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">New decision</h1>
        <p className="text-sm text-neutral-500 mt-1">Capture what was decided and why.</p>
      </div>
      <DecisionForm mode="create" ownerId={user.id} ownerName={user.name} />
    </div>
  );
}
