"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { getWorkspaceForUser } from "@/server/data-access/workspaces";
import { createComment } from "@/server/data-access/comments";
import { createActivityEntry } from "@/server/data-access/activity";
import { commentSchema } from "@/lib/validations/decision.schema";
import { revalidatePath } from "next/cache";

export async function addCommentAction(input: { decisionId: string; content: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Not authenticated" } as const;

  const membership = await getWorkspaceForUser(session.user.id);
  if (!membership) return { success: false, error: "No workspace" } as const;

  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors } as const;
  }

  try {
    const comment = await createComment(parsed.data.decisionId, session.user.id, parsed.data.content);
    await createActivityEntry(parsed.data.decisionId, session.user.id, "COMMENTED");
    revalidatePath(`/decisions/${parsed.data.decisionId}`);
    return { success: true, data: { commentId: comment.id } } as const;
  } catch {
    return { success: false, error: "Failed to add comment" } as const;
  }
}
