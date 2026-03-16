"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { createWorkspaceForUser } from "@/server/services/workspace.service";
import { workspaceSchema } from "@/lib/validations/auth.schema";

export async function createWorkspaceAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Not authenticated" } as const;

  const parsed = workspaceSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, error: "Invalid workspace name", fieldErrors: parsed.error.flatten().fieldErrors } as const;
  }

  try {
    const workspace = await createWorkspaceForUser(session.user.id, parsed.data.name);
    return { success: true, data: { workspaceId: workspace.id, slug: workspace.slug } } as const;
  } catch {
    return { success: false, error: "Failed to create workspace" } as const;
  }
}
