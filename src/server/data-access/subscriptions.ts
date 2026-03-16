import "server-only";
import { db } from "@/server/db";

export async function getSubscriptionByWorkspace(workspaceId: string) {
  return db.subscription.findUnique({ where: { workspaceId } });
}

export async function upsertSubscriptionByStripeId(
  stripeCustomerId: string,
  data: {
    workspaceId?: string;
    stripeSubscriptionId?: string | null;
    stripePriceId?: string | null;
    stripeProductId?: string | null;
    status?: string;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    cancelAtPeriodEnd?: boolean;
    trialStart?: Date | null;
    trialEnd?: Date | null;
  }
) {
  return db.subscription.upsert({
    where: { stripeCustomerId },
    create: {
      stripeCustomerId,
      workspaceId: data.workspaceId!,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripePriceId: data.stripePriceId,
      stripeProductId: data.stripeProductId,
      status: (data.status ?? "TRIALING") as Parameters<typeof db.subscription.create>[0]["data"]["status"],
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      trialStart: data.trialStart,
      trialEnd: data.trialEnd,
    },
    update: {
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripePriceId: data.stripePriceId,
      stripeProductId: data.stripeProductId,
      status: data.status as Parameters<typeof db.subscription.update>[0]["data"]["status"],
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      trialStart: data.trialStart,
      trialEnd: data.trialEnd,
    },
  });
}

export async function getOrCreateStripeCustomerId(workspaceId: string, stripeCustomerId: string) {
  const existing = await db.subscription.findUnique({ where: { workspaceId } });
  if (existing) return existing.stripeCustomerId;

  await db.subscription.create({
    data: {
      workspaceId,
      stripeCustomerId,
      status: "TRIALING",
    },
  });
  return stripeCustomerId;
}
