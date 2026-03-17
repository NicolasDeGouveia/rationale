import { z } from "zod";

export const decisionCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().max(1000).optional(),
  context: z.string().max(5000).optional(),
  rationale: z.string().max(5000).optional(),
  status: z.enum(["DRAFT", "DECIDED"]).default("DECIDED"),
  ownerId: z.string().min(1, "Owner is required"),
  participants: z.array(z.string()).default([]),
  decisionDate: z.string().optional(),
  reviewDate: z.string().optional(),
  alternatives: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        rejected: z.boolean().default(true),
      })
    )
    .default([]),
  assumptions: z.array(z.object({ content: z.string().min(1) })).default([]),
  risks: z.array(z.object({ content: z.string().min(1) })).default([]),
  tags: z.array(z.string()).default([]),
  links: z
    .array(z.object({ url: z.string().url(), label: z.string().optional() }))
    .default([]),
});

export const decisionUpdateSchema = decisionCreateSchema.partial().extend({
  decisionId: z.string().min(1),
  workspaceId: z.string().min(1),
});

export const decisionStatusSchema = z.object({
  decisionId: z.string().min(1),
  workspaceId: z.string().min(1),
  status: z.enum(["DRAFT", "DECIDED", "REOPENED", "ARCHIVED"]),
});

export const searchDecisionsSchema = z.object({
  workspaceId: z.string().min(1),
  query: z.string().optional(),
  status: z.array(z.enum(["DRAFT", "DECIDED", "REOPENED", "ARCHIVED"])).optional(),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  reviewDateFrom: z.string().optional(),
  reviewDateTo: z.string().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const commentSchema = z.object({
  decisionId: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(5000),
});

export const rescheduleReviewSchema = z.object({
  decisionId: z.string().min(1),
  workspaceId: z.string().min(1),
  reviewDate: z.string().min(1, "Review date is required"),
});

export type DecisionCreateInput = z.infer<typeof decisionCreateSchema>;
export type DecisionUpdateInput = z.infer<typeof decisionUpdateSchema>;
