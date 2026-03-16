import "server-only";
import { db } from "@/server/db";

export async function upsertTag(workspaceId: string, name: string) {
  return db.tag.upsert({
    where: { workspaceId_name: { workspaceId, name: name.toLowerCase().trim() } },
    create: { workspaceId, name: name.toLowerCase().trim() },
    update: {},
  });
}

export async function getTagsByWorkspace(workspaceId: string) {
  return db.tag.findMany({ where: { workspaceId }, orderBy: { name: "asc" } });
}
