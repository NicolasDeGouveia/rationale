"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { createCheckoutSession, createBillingPortalSession } from "@/server/services/billing.service";

export async function createCheckoutSessionAction(input: { priceId: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Not authenticated" } as const;

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) return { success: false, error: "No workspace" } as const;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const url = await createCheckoutSession(
      membership.workspaceId,
      session.user.id,
      input.priceId,
      `${baseUrl}/settings/billing?success=1`,
      `${baseUrl}/settings/billing?canceled=1`
    );
    redirect(url);
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("[checkout]", err);
    return { success: false, error: "Failed to create checkout session" } as const;
  }
}

export async function createBillingPortalSessionAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Not authenticated" } as const;

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) return { success: false, error: "No workspace" } as const;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const url = await createBillingPortalSession(
      membership.workspaceId,
      session.user.id,
      `${baseUrl}/settings/billing`
    );
    redirect(url);
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { success: false, error: "Failed to open billing portal" } as const;
  }
}
