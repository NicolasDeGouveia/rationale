import "server-only";
import { createWorkspace, createWorkspaceMembership, getWorkspaceBySlug } from "@/server/data-access/workspaces";
import { generateSlug } from "@/lib/utils";

export async function createWorkspaceForUser(userId: string, name: string) {
  let slug = generateSlug(name);

  // Ensure slug uniqueness
  const existing = await getWorkspaceBySlug(slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const workspace = await createWorkspace({ name, slug });
  await createWorkspaceMembership({ userId, workspaceId: workspace.id, role: "ADMIN" });

  return workspace;
}
