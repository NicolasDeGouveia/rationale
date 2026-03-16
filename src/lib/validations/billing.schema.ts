import { z } from "zod";

export const checkoutSessionSchema = z.object({
  workspaceId: z.string().min(1),
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const billingPortalSchema = z.object({
  workspaceId: z.string().min(1),
  returnUrl: z.string().url(),
});
