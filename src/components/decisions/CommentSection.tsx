"use client";

import { useState, useTransition } from "react";
import { addCommentAction } from "@/server/actions/comment.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeDate } from "@/lib/utils";
import type { CommentItem } from "@/types";

interface CommentSectionProps {
  decisionId: string;
  comments: CommentItem[];
  currentUserId: string;
}

export function CommentSection({ decisionId, comments: initialComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");

    startTransition(async () => {
      const result = await addCommentAction({ decisionId, content: content.trim() });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setComments((prev) => [
        ...prev,
        {
          id: result.data.commentId,
          author: { id: currentUserId, name: "You" },
          content: content.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setContent("");
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Comments</h2>

      {comments.length === 0 ? (
        <p className="text-sm text-neutral-400 italic">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar name={c.author.name ?? undefined} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-neutral-800">{c.author.name ?? "Unknown"}</span>
                  <span className="text-xs text-neutral-400">{formatRelativeDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-neutral-700 mt-0.5 whitespace-pre-wrap">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 pt-2">
        <Textarea
          label="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share context, ask questions, or note updates..."
          className="min-h-20"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" size="sm" loading={pending} disabled={!content.trim()}>
          Post comment
        </Button>
      </form>
    </div>
  );
}
