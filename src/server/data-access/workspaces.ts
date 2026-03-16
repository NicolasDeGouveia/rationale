import "server-only";
import { db } from "@/server/db";

export async function createWorkspace(data: { name: string; slug: string }) {
  return db.workspace.create({ data });
}

export async function getWorkspaceById(id: string) {
  return db.workspace.findUnique({ where: { id } });
}

export async function getWorkspaceBySlug(slug: string) {
  return db.workspace.findUnique({ where: { slug } });
}

export async function getWorkspaceForUser(userId: string) {
  const membership = await db.workspaceMembership.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: { subscription: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return membership ?? null;
}

export async function createWorkspaceMembership(data: {
  userId: string;
  workspaceId: string;
  role: "ADMIN" | "MEMBER";
}) {
  return db.workspaceMembership.create({ data });
}

export async function getWorkspaceMembers(workspaceId: string) {
  return db.workspaceMembership.findMany({
    where: { workspaceId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
}
