import { getAuthContext } from "@/server/auth-context";
import { getWorkspaceMembers } from "@/server/data-access/workspaces";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Paramètres — Rationale" };

export default async function SettingsPage() {
  const { user, membership } = await getAuthContext();

  const members = await getWorkspaceMembers(membership.workspaceId);
  const isAdmin = membership.role === "ADMIN";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Paramètres</h1>
        <p className="text-sm text-neutral-500 mt-1">Paramètres de l&apos;espace de travail et du compte.</p>
      </div>

      <div className="space-y-6">
        {/* Workspace info */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-3">
          <h2 className="text-sm font-semibold text-neutral-700">Espace de travail</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Nom</p>
              <p className="font-medium text-neutral-900">{membership.workspace.name}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Slug</p>
              <p className="text-neutral-600 font-mono text-xs">{membership.workspace.slug}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Votre rôle</p>
              <p className="font-medium text-neutral-900 capitalize">{membership.role.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-3">
          <h2 className="text-sm font-semibold text-neutral-700">Membres ({members.length})</h2>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={m.user.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{m.user.name ?? "Inconnu"}</p>
                    <p className="text-xs text-neutral-400">{m.user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-400 capitalize">{m.role.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Billing shortcut */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-700">Billing</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Gérez votre abonnement et votre plan.</p>
            </div>
            <Link href="/settings/billing">
              <Button variant="secondary" size="sm">Voir la facturation</Button>
            </Link>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-2">
          <h2 className="text-sm font-semibold text-neutral-700">Compte</h2>
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="md" />
            <div>
              <p className="text-sm font-medium text-neutral-900">{user.name ?? "—"}</p>
              <p className="text-xs text-neutral-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
