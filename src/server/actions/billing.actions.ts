"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { createCheckoutSession, createBillingPortalSession } from "@/server/services/billing.service";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getSessionAndWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) return null;
  return { user: session.user, membership };
}

export async function createCheckoutSessionAction(input: { priceId: string }) {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  try {
    const url = await createCheckoutSession(
      ctx.membership.workspaceId,
      ctx.user.id,
      input.priceId,
      `${BASE_URL}/settings/billing?success=1`,
      `${BASE_URL}/settings/billing?canceled=1`
    );
    redirect(url);
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("[checkout]", err);
    return { success: false, error: "Failed to create checkout session" } as const;
  }
}

export async function createBillingPortalSessionAction() {
  const ctx = await getSessionAndWorkspace();
  if (!ctx) return { success: false, error: "Not authenticated" } as const;

  try {
    const url = await createBillingPortalSession(
      ctx.membership.workspaceId,
      ctx.user.id,
      `${BASE_URL}/settings/billing`
    );
    redirect(url);
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { success: false, error: "Failed to open billing portal" } as const;
  }
}
