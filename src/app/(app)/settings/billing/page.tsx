import { getAuthContext } from "@/server/auth-context";
import { getSubscriptionByWorkspace } from "@/server/data-access/subscriptions";
import { BillingPageClient } from "./_components/BillingPageClient";

export const metadata = { title: "Billing — Rationale" };

interface Props {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function BillingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { membership } = await getAuthContext();

  const subscription = await getSubscriptionByWorkspace(membership.workspaceId);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Billing</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your plan and subscription.</p>
      </div>
      {sp.success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          Your subscription has been activated. Thank you!
        </div>
      )}
      {sp.canceled && (
        <div className="mb-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-600">
          Checkout was canceled. Your plan has not changed.
        </div>
      )}
      <BillingPageClient subscription={subscription} isAdmin={membership.role === "ADMIN"} />
    </div>
  );
}
