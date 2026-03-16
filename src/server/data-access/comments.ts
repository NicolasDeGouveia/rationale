import "server-only";
import { db } from "@/server/db";
import type { CommentItem } from "@/types";

export async function createComment(decisionId: string, authorId: string, content: string) {
  return db.comment.create({ data: { decisionId, authorId, content } });
}

export async function getCommentsByDecision(decisionId: string): Promise<CommentItem[]> {
  const comments = await db.comment.findMany({
    where: { decisionId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });
  return comments.map((c) => ({
    id: c.id,
    author: c.author,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
  }));
}
