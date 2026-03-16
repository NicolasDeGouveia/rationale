"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { generateDecisionDraft } from "@/server/services/ai-draft.service";

export async function generateDecisionDraftAction(input: { notes: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Not authenticated" } as const;

  const { notes } = input;
  if (!notes || notes.trim().length < 10) {
    return { success: false, error: "Notes must be at least 10 characters." } as const;
  }
  if (notes.length > 10000) {
    return { success: false, error: "Notes must be under 10,000 characters." } as const;
  }

  try {
    const draft = await generateDecisionDraft(notes.trim());
    return { success: true, data: draft } as const;
  } catch {
    return { success: false, error: "Failed to generate draft. Please try again." } as const;
  }
}
