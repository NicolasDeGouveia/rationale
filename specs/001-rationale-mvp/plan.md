# Implementation Plan: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rationale-mvp/spec.md`

---

## Summary

Rationale is a B2B SaaS "decision memory for teams" built as a single Next.js codebase
covering both a public marketing site and a workspace-scoped authenticated application.
The MVP enables structured decision capture, search and retrieval, review inbox management,
AI-assisted drafting, and Stripe subscription billing.

**Technical approach**: Next.js 15+ App Router + TypeScript, Prisma + PostgreSQL,
Better Auth (Organizations plugin), Stripe Checkout + Billing Portal, Tailwind CSS v4,
server-side data access via Server Actions. Single repository, single design system.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+
**Primary Dependencies**: Next.js 16, React 19, Prisma 6, Better Auth 1.5.x,
Stripe SDK, Tailwind CSS v4, Zod, Resend (email)
**Storage**: PostgreSQL 15+ (Neon for production)
**Testing**: Vitest (unit/service), Playwright (E2E critical flows)
**Target Platform**: Web (desktop-first, responsive)
**Project Type**: Web application (monorepo, single codebase)
**Performance Goals**: Landing page LCP < 2s; app navigation < 300ms; search results < 1s
**Constraints**: No client-side complexity for server-renderable content; no unnecessary
dependencies; bundle size kept minimal
**Scale/Scope**: MVP — hundreds to low thousands of decisions per workspace;
tens to hundreds of workspaces total at launch

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Notes |
|-----------|-------|-------|
| I. Code Quality | ✅ | Server Actions are thin; services own business logic; data-access layer is separate |
| II. Testing Standards | ✅ | Vitest for services; Playwright E2E for decision CRUD, search, billing, reminders |
| III. UX Consistency | ✅ | Unified layout system; `(marketing)` + `(app)` route groups share design tokens |
| IV. Performance | ✅ | Server-rendered pages; Prisma contains for search (no extra infra); lazy AI calls |
| V. Product Philosophy | ✅ | MVP answers exactly 4 questions; deferred features documented in roadmap.md |
| VI. Design Principles | ✅ | Tailwind-based design system; B2B sober style; no flashy aesthetics |
| VII. Delivery | ✅ | Single codebase; roadmap.md is centralized source of truth; incremental delivery |

No constitution violations. No Complexity Tracking entries required.

---

## Project Structure

### Documentation (this feature)

```
specs/
├── roadmap.md                        # Centralized feature roadmap (single source of truth)
└── 001-rationale-mvp/
    ├── spec.md                       # Feature specification
    ├── plan.md                       # This file
    ├── research.md                   # Phase 0 research findings
    ├── data-model.md                 # Prisma schema + entity decisions
    ├── quickstart.md                 # Developer setup guide
    ├── contracts/
    │   ├── server-actions.md         # Server Action input/output contracts
    │   └── ui-types.md               # UI DTO types
    └── tasks.md                      # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```
rationale/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx                  # Root shell: fonts, providers
│   │   │
│   │   ├── (marketing)/                # Public marketing — no auth required
│   │   │   ├── layout.tsx              # Marketing nav + footer
│   │   │   ├── page.tsx                # / landing page
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── demo/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                     # Login / signup — no app shell
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (app)/                      # Authenticated app — sidebar layout
│   │   │   ├── layout.tsx              # Sidebar + workspace context provider
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── decisions/
│   │   │   │   ├── page.tsx            # Decision list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Create decision
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # Decision detail
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx    # Edit decision
│   │   │   │       └── _components/
│   │   │   │           ├── DecisionDetail.tsx
│   │   │   │           ├── DecisionForm.tsx
│   │   │   │           ├── CommentSection.tsx
│   │   │   │           └── ActivityLog.tsx
│   │   │   ├── review/
│   │   │   │   └── page.tsx            # Review inbox
│   │   │   ├── search/
│   │   │   │   └── page.tsx            # Search
│   │   │   └── settings/
│   │   │       ├── page.tsx            # Workspace settings
│   │   │       └── billing/
│   │   │           └── page.tsx        # Billing & subscription
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...betterauth]/
│   │       │       └── route.ts        # Better Auth catch-all
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts        # Stripe webhook handler
│   │
│   ├── components/
│   │   ├── ui/                         # Primitive design-system components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx               # Status badges
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── index.ts
│   │   ├── marketing/                  # Landing page section components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BeforeAfterSection.tsx
│   │   │   ├── WorkflowSection.tsx
│   │   │   ├── AppPreviewSection.tsx
│   │   │   └── CTASection.tsx
│   │   └── app/                        # App shell components
│   │       ├── Sidebar.tsx
│   │       ├── DecisionCard.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── ReviewUrgencyBadge.tsx
│   │       └── UserAvatar.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts                    # cn(), formatDate(), etc.
│   │   ├── constants.ts                # App-wide constants, plan definitions
│   │   └── validations/
│   │       ├── decision.schema.ts      # Zod schemas for decision forms
│   │       ├── auth.schema.ts
│   │       └── billing.schema.ts
│   │
│   ├── server/                         # Server-only (import "server-only")
│   │   ├── auth.ts                     # Better Auth instance configuration
│   │   ├── db/
│   │   │   ├── client.ts               # Prisma singleton
│   │   │   └── index.ts
│   │   ├── data-access/
│   │   │   ├── decisions.ts
│   │   │   ├── workspaces.ts
│   │   │   ├── users.ts
│   │   │   ├── comments.ts
│   │   │   ├── activity.ts
│   │   │   ├── reminders.ts
│   │   │   └── subscriptions.ts
│   │   ├── services/
│   │   │   ├── decision.service.ts
│   │   │   ├── review.service.ts
│   │   │   ├── ai-draft.service.ts
│   │   │   └── billing.service.ts
│   │   └── actions/
│   │       ├── decision.actions.ts
│   │       ├── review.actions.ts
│   │       ├── billing.actions.ts
│   │       └── ai-draft.actions.ts
│   │
│   ├── types/
│   │   ├── decision.ts
│   │   ├── workspace.ts
│   │   ├── billing.ts
│   │   └── index.ts
│   │
│   └── middleware.ts                   # Auth protection: covers all (app) routes
│
├── prisma/
│   ├── schema.prisma                   # Full schema from data-model.md
│   └── migrations/
│
├── tests/
│   ├── unit/                           # Vitest: service logic, utilities
│   │   ├── decision.service.test.ts
│   │   ├── review.service.test.ts
│   │   └── billing.service.test.ts
│   └── e2e/                            # Playwright: critical user flows
│       ├── decision-creation.spec.ts
│       ├── search.spec.ts
│       ├── review-inbox.spec.ts
│       └── billing.spec.ts
│
├── .env.local                          # Local env (gitignored)
├── next.config.ts
├── prisma/schema.prisma
└── package.json
```

**Structure Decision**: Single Next.js project (Option 1 pattern). Route groups
`(marketing)`, `(auth)`, and `(app)` provide layout isolation without affecting URLs.
Server-only code lives under `src/server/` with `import "server-only"` guards.
No separate backend process; all server logic runs in Next.js Server Actions and
Route Handlers.

---

## Architecture Overview

### Data Flow

```
Browser → Server Component (reads session + workspace context)
        → calls server/data-access/* directly or via Server Action
        → Server Action validates input (Zod) → calls service
        → service calls data-access → returns to component as props
        → Client Component receives typed DTOs (no Prisma types)
```

### Auth Flow (Better Auth)

```
Signup/Login → Better Auth handles → Session created in DB
→ middleware.ts checks session on every (app) route
→ Server Components call auth.api.getSession(headers()) for user context
→ Workspace context injected via (app)/layout.tsx server component
```

### Billing Flow (Stripe)

```
Admin clicks Upgrade → createCheckoutSession() action
→ Stripe Checkout page → payment → redirect to success URL
→ Stripe webhook (POST /api/webhooks/stripe) fires checkout.session.completed
→ webhook handler upserts Subscription row in DB
→ Next page load reads updated subscription status from DB
```

### Search Flow

```
User types query → searchDecisions() action (Server Action or route handler)
→ Prisma findMany with OR: [title.contains, summary.contains, rationale.contains]
→ mode: 'insensitive' → results returned as DecisionSummary[]
→ Client component renders results list
```

### Review Inbox Flow

```
Page load → reviewInboxQuery: Prisma findMany decisions WHERE
  reviewDate < now() OR reviewDate BETWEEN now() AND now()+7d OR reviewDate IS NULL
  AND status NOT IN [ARCHIVED]
→ grouped by urgency (overdue / due_soon / missing)
→ User takes action (reopen/archive/reschedule) → Server Action → immediate refetch
```

### AI Draft Flow (isolated)

```
User pastes notes → generateDecisionDraft() action
→ server/services/ai-draft.service.ts → LLM API call
→ structured draft returned to client (never persisted automatically)
→ user reviews and edits → calls createDecision() to save
```

---

## Billing Architecture

**Tier structure for MVP**:

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | Up to 25 decisions, 1 workspace member |
| Pro | TBD (e.g. $29/mo) | Unlimited decisions, unlimited members, AI drafting |

**Access gating**:
- Free tier: full app access up to limits; limits are soft at MVP (no hard block)
- Pro tier: `subscription.status IN (active, trialing) AND currentPeriodEnd > now()`
- AI drafting gated to Pro (simplest gating to implement for MVP)

**Stripe Customer lifecycle**:
1. Created lazily on first checkout (not at signup) via `stripe.customers.create`
2. `stripeCustomerId` stored on `User` row immediately
3. Checkout Session created with `customer: stripeCustomerId`

**Webhook idempotency**: All handlers use `upsert` on `stripeSubscriptionId`.

---

## Roadmap & Feature Tracking Architecture

**Single source of truth**: `specs/roadmap.md`

**Structure**:
- Each feature has an ID (F-001…), status, spec link, acceptance criteria, dependencies
- Status field updated inline as features move through states
- No external tool required — the file is inspectable by any implementation agent

**How implementation agents use it**:
1. Read `specs/roadmap.md` to identify `planned` features with no `blocked` dependencies
2. Read the linked spec and plan artifacts for the feature
3. Implement, then update the feature status to `done` in roadmap.md
4. Commit the roadmap update alongside the implementation

---

## Testing Approach

### Unit Tests (Vitest)

Target: `src/server/services/`

- `decision.service.test.ts` — createDecision, updateDecision, status transitions
- `review.service.test.ts` — inbox query logic, urgency grouping
- `billing.service.test.ts` — access gating, subscription status evaluation

Mock Prisma client using `vitest-mock-extended` or manual mocks.

### E2E Tests (Playwright)

Target: critical user flows from spec.md

- `decision-creation.spec.ts` — full create flow, validation, save, list appearance
- `search.spec.ts` — keyword search returns correct results
- `review-inbox.spec.ts` — overdue decision appears, reopen/archive/reschedule work
- `billing.spec.ts` — Stripe test mode checkout, subscription status reflects after

Use Playwright with a test database (separate `DATABASE_URL` in `.env.test`).
Use Stripe test mode and Stripe CLI for billing E2E.

### What NOT to test

- UI rendering (snapshot tests, visual regression) — not worth the fragility at MVP
- Prisma migrations — trust Prisma's own test suite
- Stripe API responses — mock at the service boundary

---

## Deployment Approach

**Platform**: Vercel (simplest for Next.js, zero config)

**Database**: Neon (serverless PostgreSQL; scales to zero between requests; free tier
for development)

**Deployment flow**:
1. Push to `main` → Vercel builds and deploys automatically
2. Vercel preview deployments on every PR
3. `prisma migrate deploy` runs as part of the Vercel build command
4. Environment variables set in Vercel dashboard (not in repo)

**Stripe webhooks in production**:
- Register `https://yourdomain.com/api/webhooks/stripe` in Stripe dashboard
- Use a separate webhook endpoint secret for production vs. local

---

## Risks & Tradeoffs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth is relatively young (stable ~18 months) | Medium — API may shift between minor versions | Pin version; review changelog before upgrades |
| Prisma `contains` search is sequential at scale | Low at MVP; medium at 10k+ records | Documented migration path to tsvector in research.md |
| Single DB for all tenants | Low at MVP scale | Neon's branching enables per-PR preview DBs |
| AI drafting latency (LLM API call) | Medium UX impact | Show loading state; isolate behind async action; do not block the UI |
| Stripe webhook delivery order not guaranteed | Medium — subscription state could lag | Upsert by `stripeSubscriptionId`; last-write wins is safe for status updates |
| Single codebase for marketing + app | Low — route groups handle layout isolation cleanly | If marketing needs a CDN/edge deployment separately, extract `(marketing)` to a separate Next.js app — low migration cost |
| No email reminders at MVP | Medium — review inbox may be missed | Document as known limitation; add email reminders as F-018 in roadmap.md |
