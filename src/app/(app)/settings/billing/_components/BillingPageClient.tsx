"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createCheckoutSessionAction, createBillingPortalSessionAction } from "@/server/actions/billing.actions";
import { PLANS } from "@/lib/constants";

interface Subscription {
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripePriceId: string | null;
}

interface BillingPageClientProps {
  subscription: Subscription | null;
  isAdmin: boolean;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  TRIALING: { label: "Trial", color: "text-blue-700 bg-blue-50 border-blue-200" },
  PAST_DUE: { label: "Past due", color: "text-red-700 bg-red-50 border-red-200" },
  CANCELED: { label: "Canceled", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
  INCOMPLETE: { label: "Incomplete", color: "text-amber-700 bg-amber-50 border-amber-200" },
  PAUSED: { label: "Paused", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
};

export function BillingPageClient({ subscription, isAdmin }: BillingPageClientProps) {
  const [checkoutPending, startCheckout] = useTransition();
  const [portalPending, startPortal] = useTransition();

  const isActivePaid =
    subscription &&
    (subscription.status === "ACTIVE" || subscription.status === "TRIALING") &&
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date());

  function handleUpgrade() {
    startCheckout(async () => {
      await createCheckoutSessionAction({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "" });
    });
  }

  function handleManageBilling() {
    startPortal(async () => {
      await createBillingPortalSessionAction();
    });
  }

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Current plan</p>
            <p className="text-base font-semibold text-neutral-900">
              {isActivePaid ? PLANS.pro.name : PLANS.free.name}
            </p>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isActivePaid ? PLANS.pro.description : PLANS.free.description}
            </p>
          </div>
          {subscription && STATUS_LABELS[subscription.status] && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_LABELS[subscription.status].color}`}>
              {STATUS_LABELS[subscription.status].label}
            </span>
          )}
        </div>

        {subscription?.currentPeriodEnd && isActivePaid && (
          <p className="text-xs text-neutral-400">
            {subscription.cancelAtPeriodEnd
              ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
              : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
          </p>
        )}

        {subscription?.status === "PAST_DUE" && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            Your last payment failed. Please update your payment method to continue your subscription.
          </div>
        )}

        {isAdmin && (
          <div className="pt-1 flex gap-2">
            {!isActivePaid ? (
              <Button onClick={handleUpgrade} loading={checkoutPending} size="sm">
                Upgrade to Pro
              </Button>
            ) : (
              <Button onClick={handleManageBilling} loading={portalPending} variant="secondary" size="sm">
                Manage billing
              </Button>
            )}
          </div>
        )}
        {!isAdmin && (
          <p className="text-xs text-neutral-400">Only workspace admins can manage billing.</p>
        )}
      </div>

      {/* Plan comparison */}
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-neutral-200">
          <div className="p-5 space-y-3">
            <p className="text-sm font-semibold text-neutral-900">{PLANS.free.name}</p>
            <ul className="space-y-1.5">
              {PLANS.free.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
                  <span className="text-neutral-300">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 space-y-3 bg-neutral-50">
            <p className="text-sm font-semibold text-neutral-900">{PLANS.pro.name}</p>
            <ul className="space-y-1.5">
              {PLANS.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-neutral-700">
                  <span className="text-neutral-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
