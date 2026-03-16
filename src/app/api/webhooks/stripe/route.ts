import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertSubscriptionByStripeId } from "@/server/data-access/subscriptions";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function stripeStatusToEnum(status: string): string {
  const map: Record<string, string> = {
    active: "ACTIVE",
    trialing: "TRIALING",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    paused: "PAUSED",
    unpaid: "PAST_DUE",
  };
  return map[status] ?? "ACTIVE";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractSubscriptionData(sub: any) {
  return {
    id: sub.id as string,
    customerId: sub.customer as string,
    priceId: sub.items?.data?.[0]?.price?.id as string | undefined,
    productId: sub.items?.data?.[0]?.price?.product as string | undefined,
    status: stripeStatusToEnum(sub.status as string),
    currentPeriodStart: sub.current_period_start != null ? new Date((sub.current_period_start as number) * 1000) : null,
    currentPeriodEnd: sub.current_period_end != null ? new Date((sub.current_period_end as number) * 1000) : null,
    cancelAtPeriodEnd: (sub.cancel_at_period_end as boolean) ?? false,
    metadata: sub.metadata as Record<string, string>,
  };
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
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        if (session.mode === "subscription" && session.subscription && session.customer) {
          const rawSub = await stripe.subscriptions.retrieve(session.subscription as string);
          const sub = extractSubscriptionData(rawSub);
          const workspaceId = session.metadata?.workspaceId ?? sub.metadata?.workspaceId;
          if (workspaceId) {
            await upsertSubscriptionByStripeId(session.customer as string, {
              workspaceId,
              stripeSubscriptionId: sub.id,
              stripePriceId: sub.priceId,
              stripeProductId: sub.productId,
              status: sub.status,
              currentPeriodStart: sub.currentPeriodStart,
              currentPeriodEnd: sub.currentPeriodEnd,
              cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            });
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawSub = event.data.object as any;
        const sub = extractSubscriptionData(rawSub);
        await upsertSubscriptionByStripeId(sub.customerId, {
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.priceId,
          stripeProductId: sub.productId,
          status: sub.status,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        });
        break;
      }

      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        if (invoice.subscription && invoice.customer) {
          await upsertSubscriptionByStripeId(invoice.customer as string, {
            status: "PAST_DUE",
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
