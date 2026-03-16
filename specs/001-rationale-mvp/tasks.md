---
description: "Task list for Rationale MVP implementation"
---

# Tasks: Rationale MVP

**Input**: Design documents from `/specs/001-rationale-mvp/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅

**Roadmap**: `specs/roadmap.md` — update feature status as each phase completes.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story. Tests are not included unless explicitly requested.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US8)
- Include exact file paths in all descriptions

## User Story Index

| Story | Description | Priority | Roadmap |
|-------|-------------|----------|---------|
| US1 | Project Setup & Infrastructure | P0 | F-001, F-002 |
| US2 | Design System & Shared UI | P1 | F-006 |
| US3 | Landing Page | P1 | F-005, F-017 |
| US4 | Auth & Workspace Onboarding | P1 | F-003, F-004 |
| US5 | Decision CRUD (list, create, edit, detail) | P1 | F-007, F-008, F-009 |
| US6 | Search & Filtering | P2 | F-010 |
| US7 | Review Inbox & Reminders | P3 | F-011 |
| US8 | Comments & Activity Log | P3 | F-012, F-013 |
| US9 | Billing & Stripe | P4 | F-015 |
| US10 | AI-Assisted Draft | P4 | F-014 |
| US11 | Settings Pages | P4 | F-016 |

---

## Phase 1: Setup & Infrastructure

**Purpose**: Install dependencies, configure tooling, initialize database.
Update `specs/roadmap.md`: set F-001 to `in_progress` when starting.

- [ ] T001 Install Prisma and configure `prisma/schema.prisma` with PostgreSQL provider and DATABASE_URL
- [ ] T002 [P] Install Better Auth: `npm install better-auth`
- [ ] T003 [P] Install Stripe SDK: `npm install stripe @stripe/stripe-js`
- [ ] T004 [P] Install Zod: `npm install zod`
- [ ] T005 [P] Install Resend for email: `npm install resend`
- [ ] T006 [P] Add `server-only` package: `npm install server-only`
- [ ] T007 Copy full Prisma schema from `specs/001-rationale-mvp/data-model.md` into `prisma/schema.prisma`
- [ ] T008 Run `npx prisma migrate dev --name init` to create all DB tables
- [ ] T009 Run `npx prisma generate` to generate the Prisma client
- [ ] T010 Create Prisma singleton at `src/server/db/client.ts` with global dev pattern
- [ ] T011 Create `src/server/db/index.ts` re-exporting the db client
- [ ] T012 [P] Create `.env.local` template at `.env.example` with all required variable names (no values)
- [ ] T013 [P] Add `vitest.config.ts` with TypeScript support and test file glob `tests/unit/**/*.test.ts`
- [ ] T014 [P] Install Vitest: `npm install --save-dev vitest @vitest/coverage-v8`
- [ ] T015 Update `specs/roadmap.md`: set F-001 and F-002 to `done`

**Checkpoint**: DB is migrated, Prisma client generated, all packages installed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Route structure, middleware, auth instance, shared types. Must complete before any user story.

- [ ] T016 Create route group folders: `src/app/(marketing)/`, `src/app/(auth)/`, `src/app/(app)/`
- [ ] T017 Move `src/app/page.tsx` to `src/app/(marketing)/page.tsx`
- [ ] T018 Create `src/app/(marketing)/layout.tsx` with marketing nav placeholder and footer placeholder
- [ ] T019 Create `src/app/(auth)/layout.tsx` with centered card layout (no sidebar)
- [ ] T020 Create `src/app/(app)/layout.tsx` with sidebar placeholder and workspace context slot
- [ ] T021 Create `src/server/auth.ts` — Better Auth instance with `emailAndPassword` plugin, `organization` plugin, and Prisma adapter pointing to `src/server/db/client.ts`
- [ ] T022 Create `src/app/api/auth/[...betterauth]/route.ts` — Better Auth catch-all route handler
- [ ] T023 Create `src/middleware.ts` — protect all `(app)` routes; redirect unauthenticated to `/login`
- [ ] T024 Create `src/types/decision.ts` — export `DecisionStatus`, `DecisionSummary`, `DecisionDetail`, `ActivityAction` types from `specs/001-rationale-mvp/contracts/ui-types.md`
- [ ] T025 [P] Create `src/types/workspace.ts` — export `WorkspaceContext`, `WorkspaceRole` types
- [ ] T026 [P] Create `src/types/billing.ts` — export `SubscriptionStatus`, `ReviewInboxItem`, `AIDraft` types
- [ ] T027 [P] Create `src/types/index.ts` — barrel re-export of all types
- [ ] T028 Create `src/lib/utils.ts` — `cn()` helper using `clsx` + `tailwind-merge`; install `clsx tailwind-merge`
- [ ] T029 [P] Create `src/lib/constants.ts` — `REVIEW_DUE_SOON_DAYS = 7`, plan definitions, decision status labels
- [ ] T030 [P] Create `src/lib/validations/decision.schema.ts` — Zod schemas for decision create/update forms
- [ ] T031 [P] Create `src/lib/validations/auth.schema.ts` — Zod schemas for signup, login, password reset
- [ ] T032 [P] Create `src/lib/validations/billing.schema.ts` — Zod schemas for checkout and billing portal inputs

**Checkpoint**: Route groups exist, middleware active, auth instance wired, types and validators in place.

---

## Phase 3: Design System & Shared UI (US2)

**Goal**: Primitive UI components used across marketing, app, settings, and billing pages.
Update `specs/roadmap.md`: set F-006 to `in_progress` when starting.

**Independent Test**: All UI components render without errors when imported and used with sample props.

### Implementation for US2

- [ ] T033 [P] [US2] Create `src/components/ui/button.tsx` — Button with variants: primary, secondary, ghost, destructive; sizes: sm, md, lg
- [ ] T034 [P] [US2] Create `src/components/ui/input.tsx` — Input with label, error state, helper text
- [ ] T035 [P] [US2] Create `src/components/ui/textarea.tsx` — Textarea with label, error state, character count
- [ ] T036 [P] [US2] Create `src/components/ui/badge.tsx` — Badge with color variants for DecisionStatus (DRAFT=gray, DECIDED=blue, REOPENED=amber, ARCHIVED=muted) and review urgency (overdue=red, due_soon=amber, missing=gray)
- [ ] T037 [P] [US2] Create `src/components/ui/card.tsx` — Card with header, body, footer slots; optional border, shadow
- [ ] T038 [P] [US2] Create `src/components/ui/dialog.tsx` — Modal dialog with title, body, action slot; accessible (focus trap, ESC close)
- [ ] T039 [P] [US2] Create `src/components/ui/select.tsx` — Select dropdown using native `<select>` with styled wrapper
- [ ] T040 [P] [US2] Create `src/components/ui/avatar.tsx` — User avatar with initials fallback
- [ ] T041 [P] [US2] Create `src/components/ui/spinner.tsx` — Loading spinner for async states
- [ ] T042 [P] [US2] Create `src/components/ui/empty-state.tsx` — Empty state with icon slot, title, description, CTA button slot
- [ ] T043 [US2] Create `src/components/ui/index.ts` — barrel export of all UI primitives
- [ ] T044 [US2] Create `src/components/app/StatusBadge.tsx` — wraps `badge.tsx`; accepts `DecisionStatus` prop and renders correct label + color
- [ ] T045 [P] [US2] Create `src/components/app/ReviewUrgencyBadge.tsx` — wraps `badge.tsx`; accepts `"overdue" | "due_soon" | "missing"` and renders urgency label
- [ ] T046 [P] [US2] Create `src/components/app/UserAvatar.tsx` — wraps `avatar.tsx`; accepts `{ name, image }` props
- [ ] T047 [US2] Update `specs/roadmap.md`: set F-006 to `done`

**Checkpoint**: All UI primitives exist and are importable. StatusBadge and ReviewUrgencyBadge render correctly.

---

## Phase 4: Landing Page (US3)

**Goal**: Public marketing pages explaining Rationale's value proposition.
Update `specs/roadmap.md`: set F-005 and F-017 to `in_progress` when starting.

**Independent Test**: Visit `http://localhost:3000` — landing page loads with hero, before/after, workflow, and CTA sections visible without errors.

### Implementation for US3

- [ ] T048 [US3] Create `src/components/marketing/HeroSection.tsx` — hero with headline "Don't lose the why behind your team's decisions", subheadline, CTA buttons (Request Demo, Join Beta), and a decision card mockup (static HTML/CSS, no real data)
- [ ] T049 [P] [US3] Create `src/components/marketing/BeforeAfterSection.tsx` — side-by-side visual: left = scattered context (bullet list of Slack/email snippets), right = structured decision card with title, rationale, owner, review date
- [ ] T050 [P] [US3] Create `src/components/marketing/WorkflowSection.tsx` — three-step capture / retrieve / review explanation with icons and descriptions
- [ ] T051 [P] [US3] Create `src/components/marketing/AppPreviewSection.tsx` — static mockup screenshots or illustrations of the decision list, decision detail, and review inbox screens
- [ ] T052 [P] [US3] Create `src/components/marketing/CTASection.tsx` — bottom CTA with "Start for free" and "Request a demo" buttons
- [ ] T053 [P] [US3] Create `src/components/marketing/MarketingNav.tsx` — top nav with logo, "Pricing" link, "Login" link, "Get started" CTA button
- [ ] T054 [P] [US3] Create `src/components/marketing/MarketingFooter.tsx` — footer with product name, tagline, links placeholder
- [ ] T055 [US3] Update `src/app/(marketing)/layout.tsx` — add `MarketingNav` and `MarketingFooter`
- [ ] T056 [US3] Update `src/app/(marketing)/page.tsx` — compose landing page from all marketing section components
- [ ] T057 [P] [US3] Create `src/app/(marketing)/pricing/page.tsx` — pricing page with Free and Pro plan cards using `Card` and `Button` primitives; include feature comparison table
- [ ] T058 [US3] Update `specs/roadmap.md`: set F-005 and F-017 to `done`

**Checkpoint**: Landing page renders at `/`, pricing page at `/pricing`. All sections visible, CTAs link to `/signup`.

---

## Phase 5: Auth & Workspace Onboarding (US4)

**Goal**: Email/password signup and login, password reset, workspace creation, session protection.
Update `specs/roadmap.md`: set F-003 and F-004 to `in_progress` when starting.

**Independent Test**: A new user can sign up, create a workspace, land on the dashboard, log out, and log back in. Accessing `/dashboard` while unauthenticated redirects to `/login`.

### Implementation for US4

- [ ] T059 Create `src/server/data-access/users.ts` — `getUserById`, `getUserByEmail`, `updateUserStripeCustomerId`
- [ ] T060 [P] Create `src/server/data-access/workspaces.ts` — `createWorkspace`, `getWorkspaceById`, `getWorkspaceBySlug`, `getWorkspaceForUser`
- [ ] T061 Create `src/server/services/workspace.service.ts` — `createWorkspaceForUser(userId, name)`: generates slug, creates Workspace + WorkspaceMembership(ADMIN); returns workspace
- [ ] T062 Create `src/server/actions/workspace.actions.ts` — `createWorkspaceAction(name)`: validates input (Zod), calls workspace.service, returns `ActionResult<{ workspaceId, slug }>`
- [ ] T063 [P] [US4] Create `src/app/(auth)/login/page.tsx` — login form: email + password fields, submit calls Better Auth `signIn.email`, redirects to `/dashboard` on success; uses `Input`, `Button` primitives
- [ ] T064 [P] [US4] Create `src/app/(auth)/signup/page.tsx` — signup form: name + email + password fields, submit calls Better Auth `signUp.email`, redirects to `/onboarding` on success
- [ ] T065 [US4] Create `src/app/(auth)/onboarding/page.tsx` — workspace creation form: workspace name input, submit calls `createWorkspaceAction`, redirects to `/dashboard` on success
- [ ] T066 [US4] Create `src/app/(app)/dashboard/page.tsx` — dashboard Server Component: fetches workspace context via `auth.api.getSession`, renders workspace name and "Create your first decision" CTA if no decisions; uses `EmptyState` component
- [ ] T067 [US4] Create `src/components/app/Sidebar.tsx` — sidebar with nav links: Dashboard, Decisions, Review, Search, Settings; workspace name display; logout button calling Better Auth `signOut`
- [ ] T068 [US4] Update `src/app/(app)/layout.tsx` — add `Sidebar`; inject workspace context from session into layout via Server Component query
- [ ] T069 [P] [US4] Create `src/app/(auth)/reset-password/page.tsx` — request reset form (email input); calls Better Auth `requestPasswordReset`
- [ ] T070 [P] [US4] Create `src/app/(auth)/reset-password/confirm/page.tsx` — new password form (token from URL + new password); calls Better Auth `resetPassword`
- [ ] T071 [US4] Update `specs/roadmap.md`: set F-003 and F-004 to `done`

**Checkpoint**: Full auth flow works. Protected routes redirect. Workspace is created on onboarding. Sidebar shows workspace name.

---

## Phase 6: Decision CRUD — List, Create, Edit, Detail (US5)

**Goal**: Core decision management — the primary product value.
Update `specs/roadmap.md`: set F-007, F-008, F-009 to `in_progress` when starting.

**Independent Test**: A user can create a complete decision record in under 2 minutes, see it in the list with status badge and metadata, open the detail page with rationale prominently visible, and edit any field.

### Implementation for US5

- [ ] T072 Create `src/server/data-access/decisions.ts` — `createDecision`, `updateDecision`, `getDecisionById`, `getDecisionsByWorkspace`, `deleteDecision`; each function scoped by `workspaceId`
- [ ] T073 [P] Create `src/server/data-access/tags.ts` — `upsertTag(workspaceId, name)`, `getTagsByWorkspace`, `linkTagToDecision`, `unlinkTagFromDecision`
- [ ] T074 [P] Create `src/server/data-access/activity.ts` — `createActivityEntry(decisionId, actorId, action, metadata?)`
- [ ] T075 Create `src/server/services/decision.service.ts` — `createDecision(input, actorId)`: creates Decision + nested alternatives/assumptions/risks + tags + links + ActivityEntry(CREATED); `updateDecision(input, actorId)`: updates fields, reconciles nested entities, creates ActivityEntry(UPDATED or STATUS_CHANGED)
- [ ] T076 Create `src/server/actions/decision.actions.ts` — `createDecisionAction(input)`, `updateDecisionAction(input)`, `changeDecisionStatusAction(input)`, `deleteDecisionAction(input)` — each validates with Zod from `decision.schema.ts`, calls service, returns `ActionResult<T>`
- [ ] T077 [US5] Create `src/app/(app)/decisions/page.tsx` — Server Component: fetches `DecisionSummary[]` for workspace via `getDecisionsByWorkspace`; renders decision list with `DecisionCard`; empty state with CTA to `/decisions/new`
- [ ] T078 [US5] Create `src/components/app/DecisionCard.tsx` — card showing: title, `StatusBadge`, owner name, decision date, review date, `ReviewUrgencyBadge` if applicable; links to `/decisions/[id]`
- [ ] T079 [US5] Create `src/app/(app)/decisions/new/page.tsx` — Server Component shell with `DecisionForm` in create mode
- [ ] T080 [US5] Create `src/app/(app)/decisions/[id]/_components/DecisionForm.tsx` — Client Component: full form with all decision fields; `alternatives`, `assumptions`, `risks` as dynamic add/remove lists; `tags` as tag input; `links` as URL list; submit calls `createDecisionAction` or `updateDecisionAction`; Zod validation with inline errors
- [ ] T081 [US5] Create `src/app/(app)/decisions/[id]/page.tsx` — Server Component: fetches `DecisionDetail` for decision; renders `DecisionDetailView`
- [ ] T082 [US5] Create `src/app/(app)/decisions/[id]/_components/DecisionDetail.tsx` — displays all decision fields; rationale, owner, status, review date must be visually prominent (larger type weight, top of layout); shows alternatives, assumptions, risks, links as structured lists
- [ ] T083 [P] [US5] Create `src/app/(app)/decisions/[id]/edit/page.tsx` — Server Component: fetches decision, passes to `DecisionForm` in edit mode
- [ ] T084 [US5] Update `specs/roadmap.md`: set F-007, F-008, F-009 to `done`

**Checkpoint**: Decision list, create, edit, and detail all work end-to-end. Rationale field is prominently shown. Decision creation completable in under 2 minutes.

---

## Phase 7: Search & Filtering (US6)

**Goal**: Keyword search and list filtering across decisions.
Update `specs/roadmap.md`: set F-010 to `in_progress` when starting.

**Independent Test**: A user can type a keyword in the search bar and see matching decisions appear. Filtering by status shows only decisions with that status.

### Implementation for US6

- [ ] T085 Add `searchDecisions` to `src/server/data-access/decisions.ts` — Prisma `findMany` with `OR: [title.contains, summary.contains, rationale.contains]`, `mode: 'insensitive'`; accepts optional filters: `status[]`, `ownerId`, `tags[]`, `reviewDateFrom`, `reviewDateTo`; returns `DecisionSummary[]`
- [ ] T086 Create `src/server/actions/search.actions.ts` — `searchDecisionsAction(input)`: validates with Zod, calls `searchDecisions`, returns `ActionResult<{ decisions: DecisionSummary[], total: number }>`
- [ ] T087 [US6] Create `src/app/(app)/search/page.tsx` — Server Component: reads `q` and filter params from URL `searchParams`; calls `searchDecisions` on server; passes results to `SearchResultsList`
- [ ] T088 [US6] Create `src/components/app/SearchBar.tsx` — Client Component: search input that updates URL `?q=` param on submit (or debounced); triggers navigation to `/search?q=...`
- [ ] T089 [US6] Create `src/components/app/SearchResultsList.tsx` — renders list of `DecisionCard` components from search results; shows total count; shows `EmptyState` with "No decisions match your search" when empty
- [ ] T090 [US6] Create `src/components/app/DecisionFilters.tsx` — Client Component: filter controls for status (multi-select), owner (select), tags (multi-select), review date range; updates URL params; works alongside SearchBar
- [ ] T091 [US6] Add search icon + `SearchBar` to `src/components/app/Sidebar.tsx` for quick access
- [ ] T092 [US6] Update `specs/roadmap.md`: set F-010 to `done`

**Checkpoint**: Search returns results for keywords in title/summary/rationale. Filters reduce the result set correctly. Empty state shown when no results.

---

## Phase 8: Review Inbox & Reminders (US7)

**Goal**: Grouped inbox of decisions needing review; actions from inbox.
Update `specs/roadmap.md`: set F-011 to `in_progress` when starting.

**Independent Test**: A user with a decision past its review date sees it in the "Overdue" section of the inbox. They can reopen, archive, or reschedule without leaving the inbox page.

### Implementation for US7

- [ ] T093 Create `src/server/data-access/reminders.ts` — `createReminder`, `updateReminderStatus`, `getRemindersForUser`
- [ ] T094 Add `getReviewInboxDecisions(workspaceId)` to `src/server/data-access/decisions.ts` — Prisma query: decisions WHERE `status NOT IN [ARCHIVED]` AND (`reviewDate < now()` OR `reviewDate BETWEEN now() AND now()+7d` OR `reviewDate IS NULL`); returns with urgency grouping metadata
- [ ] T095 Create `src/server/services/review.service.ts` — `getReviewInbox(workspaceId)`: calls `getReviewInboxDecisions`, maps to `ReviewInboxItem[]` with `urgency` and `daysDelta` computed; `rescheduleReview(decisionId, workspaceId, reviewDate, actorId)`: updates reviewDate + creates ActivityEntry(REVIEW_RESCHEDULED)
- [ ] T096 Create `src/server/actions/review.actions.ts` — `rescheduleReviewAction(input)`: validates, calls review.service; `changeDecisionStatusAction` already handles reopen/archive (from T076)
- [ ] T097 [US7] Create `src/app/(app)/review/page.tsx` — Server Component: calls `review.service.getReviewInbox`; groups items by urgency; passes to `ReviewInboxView`
- [ ] T098 [US7] Create `src/components/app/ReviewInboxView.tsx` — Client Component: renders three sections (Overdue, Due Soon, Missing Review Date) each with `ReviewInboxItem` cards; each card has Reopen, Archive, Reschedule action buttons; actions call Server Actions and refresh the list
- [ ] T099 [US7] Create `src/components/app/ReviewInboxCard.tsx` — displays decision title, current review date, `ReviewUrgencyBadge`, owner, and action buttons (Reopen / Archive / Reschedule); Reschedule opens an inline date picker
- [ ] T100 [US7] Add review inbox badge count to `src/components/app/Sidebar.tsx` — show count of overdue + due_soon items as a small badge on the "Review" nav link
- [ ] T101 [US7] Update `specs/roadmap.md`: set F-011 to `done`

**Checkpoint**: Review inbox shows overdue and due-soon decisions. Reopen changes status to REOPENED. Archive changes status to ARCHIVED. Reschedule updates review date and removes from inbox.

---

## Phase 9: Comments & Activity Log (US8)

**Goal**: Comments on decisions and visible activity history.
Update `specs/roadmap.md`: set F-012 and F-013 to `in_progress` when starting.

**Independent Test**: A user can add a comment to a decision and see it appear immediately below the decision detail. The activity log shows the creation event and the comment event.

### Implementation for US8

- [ ] T102 Create `src/server/data-access/comments.ts` — `createComment(decisionId, authorId, content)`, `getCommentsByDecision(decisionId)` returning `CommentItem[]`
- [ ] T103 Create `src/server/actions/comment.actions.ts` — `addCommentAction(input)`: validates (1–5000 chars), calls `createComment` + `createActivityEntry(COMMENTED)`, returns `ActionResult<{ commentId }>`
- [ ] T104 [US8] Create `src/app/(app)/decisions/[id]/_components/CommentSection.tsx` — Client Component: renders list of `CommentItem` cards (author, content, timestamp); comment input form at bottom; submit calls `addCommentAction`; optimistic update with revalidation
- [ ] T105 [US8] Create `src/app/(app)/decisions/[id]/_components/ActivityLog.tsx` — Server Component: fetches `ActivityEntry[]` via `getActivityByDecision`; renders timeline list with actor, action label, timestamp; action labels from `ActivityAction` enum
- [ ] T106 Add `getActivityByDecision(decisionId)` to `src/server/data-access/activity.ts` — returns `ActivityItem[]` sorted by `createdAt DESC`
- [ ] T107 [US8] Update `src/app/(app)/decisions/[id]/page.tsx` — add `CommentSection` and `ActivityLog` below the decision detail; tabs or vertical scroll layout
- [ ] T108 [US8] Update `specs/roadmap.md`: set F-012 and F-013 to `done`

**Checkpoint**: Comments appear on decision detail page. Activity log shows all events. New comment appears after submit without full page reload.

---

## Phase 10: Billing & Stripe (US9)

**Goal**: Subscription upgrade via Stripe Checkout, billing state sync via webhook, billing page.
Update `specs/roadmap.md`: set F-015 to `in_progress` when starting.

**Independent Test**: A workspace admin can click "Upgrade to Pro", complete Stripe Checkout with test card `4242 4242 4242 4242`, return to the app, and see their plan updated to "Pro / Active".

### Implementation for US9

- [ ] T109 Create `src/server/data-access/subscriptions.ts` — `getSubscriptionByWorkspace(workspaceId)`, `upsertSubscriptionByStripeId(stripeSubscriptionId, data)`; `createOrGetStripeCustomer(userId)` that stores `stripeCustomerId` on User
- [ ] T110 Create `src/server/services/billing.service.ts` — `createCheckoutSession(workspaceId, userId, priceId, successUrl, cancelUrl)`: creates/gets Stripe customer, creates Stripe Checkout Session (mode: `subscription`), returns `checkoutUrl`; `createBillingPortalSession(workspaceId, userId, returnUrl)`: retrieves `stripeCustomerId`, creates Stripe Billing Portal Session, returns `portalUrl`; `isWorkspaceOnPaidPlan(workspaceId)`: checks subscription status + `currentPeriodEnd`
- [ ] T111 Create `src/server/actions/billing.actions.ts` — `createCheckoutSessionAction(input)`, `createBillingPortalSessionAction(input)` — validate, call billing.service, redirect to returned URL
- [ ] T112 Create `src/app/api/webhooks/stripe/route.ts` — POST handler: reads raw body with `req.text()`, verifies Stripe signature with `stripe.webhooks.constructEvent`; handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`; calls `upsertSubscriptionByStripeId` for each event; returns 200
- [ ] T113 [US9] Create `src/app/(app)/settings/billing/page.tsx` — Server Component: fetches subscription for workspace; if no subscription: show "Free plan" with Upgrade button; if active: show plan name, status badge, renewal date, "Manage billing" button (opens portal); if past_due: show warning banner; all actions use billing Server Actions
- [ ] T114 [US9] Update `specs/roadmap.md`: set F-015 to `done`

**Checkpoint**: Upgrade flow works end-to-end in Stripe test mode. Webhook updates subscription status in DB. Billing page shows correct plan state.

---

## Phase 11: AI-Assisted Draft (US10)

**Goal**: Notes-to-draft workflow via LLM; draft presented for review, never auto-saved.
Update `specs/roadmap.md`: set F-014 to `in_progress` when starting.

**Independent Test**: A user pastes meeting notes, receives a draft with title, summary, and rationale fields populated, edits the rationale, and saves — the saved decision reflects the edited rationale, not the original AI output.

### Implementation for US10

- [ ] T115 Install OpenAI SDK (or Anthropic SDK per research decision): `npm install openai` (or `npm install @anthropic-ai/sdk`)
- [ ] T116 Create `src/server/services/ai-draft.service.ts` — `generateDecisionDraft(notes: string)`: calls LLM API with structured prompt requesting JSON output matching `AIDraft` type (title, summary, rationale, assumptions[], risks[]); validates response shape; throws on malformed response; never persists to DB
- [ ] T117 Create `src/server/actions/ai-draft.actions.ts` — `generateDecisionDraftAction(input)`: validates notes (10–10000 chars), calls `ai-draft.service.generateDecisionDraft`, returns `ActionResult<AIDraft>`
- [ ] T118 [US10] Create `src/components/app/AIDraftPanel.tsx` — Client Component: "Draft from notes" button toggles a textarea for pasting notes; submit calls `generateDecisionDraftAction`; shows `Spinner` during generation; on success, calls `onDraftReady(draft: AIDraft)` callback to populate `DecisionForm` fields; on error, shows error message; user remains in full control of all fields
- [ ] T119 [US10] Update `src/app/(app)/decisions/[id]/_components/DecisionForm.tsx` — add `AIDraftPanel` above the form fields in create mode only; when draft is ready, populate title/summary/rationale/assumptions/risks fields (overwrite empty fields, prompt before overwriting non-empty fields)
- [ ] T120 [US10] Update `specs/roadmap.md`: set F-014 to `done`

**Checkpoint**: AI draft flow populates form fields. User can edit before saving. AI output is never saved automatically. Errors show clearly without losing user input.

---

## Phase 12: Settings Pages (US11)

**Goal**: Workspace settings and billing consolidated in settings area.
Update `specs/roadmap.md`: set F-016 to `in_progress` when starting.

**Independent Test**: A workspace admin can view the settings page with workspace info and member list. Billing section shows subscription status and links to upgrade or manage billing.

### Implementation for US11

- [ ] T121 Create `src/app/(app)/settings/page.tsx` — Server Component: fetches workspace members via `getWorkspaceForUser`; displays workspace name, slug, member list with roles; admin sees "Manage" controls; non-admin sees read-only view
- [ ] T122 [US11] Update `src/app/(app)/settings/billing/page.tsx` — refine billing page to include: current plan card with status badge, `currentPeriodEnd` display, "Manage billing" button for paid plans; deferred features section noting what is available on Pro
- [ ] T123 [US11] Update `specs/roadmap.md`: set F-016 to `done`

**Checkpoint**: Settings page shows workspace info and member list. Billing section reflects subscription state accurately.

---

## Phase 13: Polish & Production Readiness

**Purpose**: Cross-cutting improvements for launch readiness.

- [ ] T124 [P] Add proper HTML `<title>` and `<meta description>` to `src/app/(marketing)/layout.tsx` and all marketing pages
- [ ] T125 [P] Add Open Graph tags to `src/app/(marketing)/page.tsx`
- [ ] T126 [P] Ensure all forms have accessible labels, `aria-describedby` for errors, and keyboard navigation
- [ ] T127 [P] Add loading states (`Spinner`, skeleton placeholders) to all data-fetching pages: decisions list, decision detail, review inbox, search
- [ ] T128 [P] Add error boundaries to `src/app/(app)/layout.tsx` and `src/app/(marketing)/layout.tsx` to prevent blank screens on unexpected errors
- [ ] T129 [P] Add `not-found.tsx` to `src/app/(app)/decisions/[id]/` — show a clean "Decision not found" page when accessing a non-existent decision ID
- [ ] T130 Audit all `src/server/` files — confirm every file starts with `import "server-only"`
- [ ] T131 [P] Run `npm run build` and resolve all TypeScript and ESLint errors
- [ ] T132 [P] Add `DATABASE_URL` and all required env vars to Vercel project settings (manual step — document in `specs/001-rationale-mvp/quickstart.md`)
- [ ] T133 [P] Register Stripe production webhook endpoint in Stripe dashboard (manual step — document in `specs/001-rationale-mvp/quickstart.md`)
- [ ] T134 Update `specs/roadmap.md`: confirm all MVP feature statuses are `done`; add any discovered gaps as new entries with `backlog` status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 completion — blocks all user stories
- **Phase 3 (Design System)**: Depends on Phase 2 — can start as soon as route structure exists
- **Phase 4 (Landing Page)**: Depends on Phase 3 (uses UI primitives)
- **Phase 5 (Auth)**: Depends on Phase 2 (requires DB and route groups)
- **Phase 6 (Decision CRUD)**: Depends on Phase 5 (requires auth + workspace context)
- **Phase 7 (Search)**: Depends on Phase 6 (requires decisions in DB)
- **Phase 8 (Review Inbox)**: Depends on Phase 6 (requires decisions with review dates)
- **Phase 9 (Comments + Activity)**: Depends on Phase 6 (extends decision detail)
- **Phase 10 (Billing)**: Depends on Phase 5 (requires user + workspace)
- **Phase 11 (AI Draft)**: Depends on Phase 6 (extends decision creation form)
- **Phase 12 (Settings)**: Depends on Phase 5 + Phase 10
- **Phase 13 (Polish)**: Depends on all phases complete

### Parallel Opportunities Within Phases

- Phase 1: T002–T006 all run in parallel (independent package installs)
- Phase 2: T024–T032 (types and validators) all run in parallel
- Phase 3: T033–T042 (all UI primitive components) run in parallel
- Phase 4: T049–T054 (all marketing sections) run in parallel
- Phase 6: T072–T074 (data-access files) run in parallel
- Phase 10: T109–T111 (billing data-access, service, actions) run in sequential order; T112 is independent

---

## Implementation Strategy

### MVP First (Phases 1–6 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation (blocks everything)
3. Complete Phase 3: Design System
4. Complete Phase 5: Auth & Workspace
5. Complete Phase 6: Decision CRUD
6. **STOP AND VALIDATE**: A user can sign up, create a workspace, create a decision, see it in the list, open the detail page with rationale prominently shown, and edit it.

### Incremental Delivery

Each phase after Phase 6 adds an independently testable increment:
- Add Phase 4 (Landing Page) → public marketing site is live
- Add Phase 7 (Search) → search is available
- Add Phase 8 (Review Inbox) → review workflow is usable
- Add Phase 9 (Comments) → collaboration on decisions works
- Add Phase 10 (Billing) → paid plans can be activated
- Add Phase 11 (AI Draft) → draft from notes available
- Add Phase 12 (Settings) → workspace management complete
- Phase 13 (Polish) → launch ready

### Roadmap Usage for Autonomous Continuation

At the start of any implementation session:
1. Read `specs/roadmap.md` to identify features with status `planned` or `in_progress`
2. Check their dependencies — only start features whose dependencies are `done`
3. Read the corresponding spec and plan artifacts for the target feature
4. Find the corresponding phase in this `tasks.md`
5. Execute unchecked tasks in phase order, respecting `[P]` parallelism markers
6. Update the roadmap status to `done` when the phase checkpoint is reached
7. Commit with a message referencing the feature ID (e.g., `feat(F-007): implement decision CRUD`)

---

## Notes

- `[P]` = different files, no dependencies on incomplete tasks in the same phase
- Story label maps each task to its user story for traceability
- Each phase has an explicit checkpoint — validate before moving to the next phase
- `specs/roadmap.md` is the single source of truth — always update it as you go
- Commit after each completed phase or logical group of tasks
- Do not build post-MVP features listed in the Deferred section of `specs/roadmap.md`
