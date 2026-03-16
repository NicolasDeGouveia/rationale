# Server Action Contracts: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16

Server Actions are the primary interface between the UI and the domain layer.
Each action validates input with Zod, calls a service, and returns a typed result.
Route Handlers are used only for external integrations (auth callbacks, Stripe webhooks).

---

## Response Shape (shared)

All Server Actions return a discriminated union:

```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

---

## Decision Actions

### `createDecision(input)`

**Input**:
```ts
{
  workspaceId: string
  title: string                    // required, 1–200 chars
  summary?: string
  context?: string
  rationale?: string
  status?: "DRAFT" | "DECIDED"     // default: DECIDED
  ownerId: string                  // required; must be workspace member
  participants?: string[]          // array of user IDs
  decisionDate?: string            // ISO date
  reviewDate?: string              // ISO date
  alternatives?: { title: string; description?: string; rejected?: boolean }[]
  assumptions?: { content: string }[]
  risks?: { content: string }[]
  tags?: string[]                  // tag names; created if not exist
  links?: { url: string; label?: string }[]
}
```

**Output**: `ActionResult<{ decisionId: string }>`

**Side effects**: creates ActivityEntry (CREATED)

---

### `updateDecision(input)`

**Input**:
```ts
{
  decisionId: string
  workspaceId: string
  // all Decision fields are optional — only provided fields are updated
  title?: string
  summary?: string
  context?: string
  rationale?: string
  status?: DecisionStatus
  ownerId?: string
  participants?: string[]
  decisionDate?: string
  reviewDate?: string
  alternatives?: { id?: string; title: string; description?: string; rejected?: boolean }[]
  assumptions?: { id?: string; content: string }[]
  risks?: { id?: string; content: string }[]
  tags?: string[]
  links?: { id?: string; url: string; label?: string }[]
}
```

**Output**: `ActionResult<{ decisionId: string }>`

**Side effects**: creates ActivityEntry (UPDATED or STATUS_CHANGED if status changed)

---

### `changeDecisionStatus(input)`

**Input**:
```ts
{
  decisionId: string
  workspaceId: string
  status: DecisionStatus
}
```

**Output**: `ActionResult<{ decisionId: string; status: DecisionStatus }>`

**Side effects**: creates ActivityEntry (STATUS_CHANGED)

---

### `deleteDecision(input)`

**Input**:
```ts
{
  decisionId: string
  workspaceId: string
}
```

**Output**: `ActionResult<void>`

**Constraint**: Only workspace ADMIN or decision owner can delete.
Hard delete for MVP; soft delete (is post-MVP).

---

## Comment Actions

### `addComment(input)`

**Input**:
```ts
{
  decisionId: string
  workspaceId: string
  content: string   // 1–5000 chars
}
```

**Output**: `ActionResult<{ commentId: string }>`

**Side effects**: creates ActivityEntry (COMMENTED)

---

## Review Actions

### `rescheduleReview(input)`

**Input**:
```ts
{
  decisionId: string
  workspaceId: string
  reviewDate: string  // ISO date, must be in the future
}
```

**Output**: `ActionResult<{ reviewDate: string }>`

**Side effects**: creates ActivityEntry (REVIEW_RESCHEDULED), updates Reminder if exists

---

## Search Actions

### `searchDecisions(input)`

**Input**:
```ts
{
  workspaceId: string
  query?: string
  status?: DecisionStatus[]
  ownerId?: string
  tags?: string[]
  reviewDateFrom?: string
  reviewDateTo?: string
  page?: number       // default: 1
  pageSize?: number   // default: 20, max: 100
}
```

**Output**:
```ts
ActionResult<{
  decisions: DecisionSummary[]  // see types contract
  total: number
  page: number
  pageSize: number
}>
```

---

## Billing Actions

### `createCheckoutSession(input)`

**Input**:
```ts
{
  workspaceId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}
```

**Output**: `ActionResult<{ checkoutUrl: string }>`

**Side effects**: creates or retrieves Stripe Customer; sets `stripeCustomerId` on User

---

### `createBillingPortalSession(input)`

**Input**:
```ts
{
  workspaceId: string
  returnUrl: string
}
```

**Output**: `ActionResult<{ portalUrl: string }>`

**Constraint**: Workspace must have an active Subscription with a `stripeCustomerId`.

---

## AI Draft Action

### `generateDecisionDraft(input)`

**Input**:
```ts
{
  workspaceId: string
  notes: string  // raw text, 10–10000 chars
}
```

**Output**:
```ts
ActionResult<{
  draft: {
    title: string
    summary: string
    rationale: string
    assumptions: string[]
    risks: string[]
  }
}>
```

**Important**: This action NEVER saves to the database. It only returns a draft for
user review. The user must explicitly call `createDecision` to persist the result.

---

## Route Handlers (external only)

### `POST /api/auth/[...betterauth]`
Better Auth catch-all handler. Manages signup, login, session, password reset.
Not called directly by app code — Better Auth client handles it.

### `POST /api/webhooks/stripe`
Stripe webhook handler. Verifies signature with `req.text()` + `stripe.webhooks.constructEvent`.
Handles: `checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.payment_failed`.
Returns 200 immediately. Updates Subscription row via upsert on `stripeSubscriptionId`.
