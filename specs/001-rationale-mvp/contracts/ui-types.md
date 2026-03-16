# UI Type Contracts: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16

These are the data shapes passed from Server Components to Client Components.
They are clean DTOs — no Prisma types leak into the UI layer.

---

## DecisionSummary
Used in decision list, search results, review inbox.

```ts
type DecisionSummary = {
  id: string
  title: string
  summary: string | null
  status: DecisionStatus
  owner: { id: string; name: string | null }
  decisionDate: string | null   // ISO date string
  reviewDate: string | null     // ISO date string
  tags: string[]
  reviewUrgency: "overdue" | "due_soon" | "missing" | null
  createdAt: string
  updatedAt: string
}
```

## DecisionDetail
Used in decision detail page.

```ts
type DecisionDetail = DecisionSummary & {
  context: string | null
  rationale: string | null
  participants: { id: string; name: string | null }[]
  alternatives: { id: string; title: string; description: string | null; rejected: boolean }[]
  assumptions: { id: string; content: string }[]
  risks: { id: string; content: string }[]
  links: { id: string; url: string; label: string | null }[]
  comments: CommentItem[]
  activity: ActivityItem[]
}
```

## CommentItem

```ts
type CommentItem = {
  id: string
  author: { id: string; name: string | null }
  content: string
  createdAt: string
}
```

## ActivityItem

```ts
type ActivityItem = {
  id: string
  actor: { id: string; name: string | null }
  action: ActivityAction
  metadata: Record<string, unknown> | null
  createdAt: string
}
```

## WorkspaceContext
Available via session / layout — passed to all app components.

```ts
type WorkspaceContext = {
  id: string
  name: string
  slug: string
  role: "ADMIN" | "MEMBER"
  subscription: {
    status: SubscriptionStatus | null
    plan: "free" | "pro"
    currentPeriodEnd: string | null
  }
}
```

## ReviewInboxItem

```ts
type ReviewInboxItem = {
  decision: DecisionSummary
  urgency: "overdue" | "due_soon" | "missing"
  daysDelta: number | null   // negative = overdue by N days, positive = due in N days
}
```

## AIDraft
Returned by `generateDecisionDraft` action, used in the draft preview UI.

```ts
type AIDraft = {
  title: string
  summary: string
  rationale: string
  assumptions: string[]
  risks: string[]
}
```
