import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertSubscriptionByStripeId } from "@/server/data-access/subscriptions";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const STRIPE_STATUS_TO_ENUM: Record<Stripe.Subscription["status"], string> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
  paused: "PAUSED",
  unpaid: "PAST_DUE",
};

function extractCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id;
}

function extractSubscriptionItem(subscription: Stripe.Subscription): {
  priceId: string | undefined;
  productId: string | undefined;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
} {
  const firstItem = subscription.items.data[0];
  return {
    priceId: firstItem?.price?.id,
    productId: typeof firstItem?.price?.product === "string"
      ? firstItem.price.product
      : firstItem?.price?.product?.id,
    currentPeriodStart: firstItem?.current_period_start != null
      ? new Date(firstItem.current_period_start * 1000)
      : null,
    currentPeriodEnd: firstItem?.current_period_end != null
      ? new Date(firstItem.current_period_end * 1000)
      : null,
  };
}

async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  checkoutSession: Stripe.Checkout.Session
) {
  if (checkoutSession.mode !== "subscription") return;
  if (!checkoutSession.subscription || !checkoutSession.customer) return;

  const subscriptionId = typeof checkoutSession.subscription === "string"
    ? checkoutSession.subscription
    : checkoutSession.subscription.id;

  const customerId = extractCustomerId(checkoutSession.customer);
  if (!customerId) return;

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const workspaceId =
    checkoutSession.metadata?.workspaceId ??
    stripeSubscription.metadata?.workspaceId;
  if (!workspaceId) return;

  const { priceId, productId, currentPeriodStart, currentPeriodEnd } =
    extractSubscriptionItem(stripeSubscription);

  await upsertSubscriptionByStripeId(customerId, {
    workspaceId,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: priceId,
    stripeProductId: productId,
    status: STRIPE_STATUS_TO_ENUM[stripeSubscription.status] ?? "ACTIVE",
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  });
}

async function handleSubscriptionChange(stripeSubscription: Stripe.Subscription) {
  const customerId = extractCustomerId(stripeSubscription.customer);
  if (!customerId) return;

  const { priceId, productId, currentPeriodStart, currentPeriodEnd } =
    extractSubscriptionItem(stripeSubscription);

  await upsertSubscriptionByStripeId(customerId, {
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: priceId,
    stripeProductId: productId,
    status: STRIPE_STATUS_TO_ENUM[stripeSubscription.status] ?? "ACTIVE",
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = extractCustomerId(invoice.customer);
  if (!customerId) return;

  await upsertSubscriptionByStripeId(customerId, { status: "PAST_DUE" });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(stripe, event.data.object);
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
