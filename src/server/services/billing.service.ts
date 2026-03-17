import "server-only";
import Stripe from "stripe";
import { getSubscriptionByWorkspace, updateStripeCustomerId } from "@/server/data-access/subscriptions";
import { getUserById } from "@/server/data-access/users";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function getOrCreateCustomer(workspaceId: string, userId: string): Promise<string> {
  const stripe = getStripe();
  const sub = await getSubscriptionByWorkspace(workspaceId);

  if (sub?.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(sub.stripeCustomerId);
      if (!existing.deleted) return sub.stripeCustomerId;
    } catch {
      // customer not found on Stripe, fall through to create a new one
    }
  }

  const user = await getUserById(userId);
  const customer = await stripe.customers.create({
    email: user?.email ?? undefined,
    name: user?.name ?? undefined,
    metadata: { workspaceId, userId },
  });
  await updateStripeCustomerId(workspaceId, customer.id);
  return customer.id;
}

export async function createCheckoutSession(
  workspaceId: string,
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateCustomer(workspaceId, userId);
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { workspaceId },
    subscription_data: { metadata: { workspaceId } },
  });
  return session.url!;
}

export async function createBillingPortalSession(
  workspaceId: string,
  userId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateCustomer(workspaceId, userId);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

export async function isWorkspaceOnPaidPlan(workspaceId: string): Promise<boolean> {
  const sub = await getSubscriptionByWorkspace(workspaceId);
  if (!sub) return false;
  if (sub.status !== "ACTIVE" && sub.status !== "TRIALING") return false;
  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) return false;
  return true;
}
