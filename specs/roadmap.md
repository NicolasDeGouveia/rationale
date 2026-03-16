# Rationale — Feature Roadmap

**Last updated**: 2026-03-16
**Source of truth**: This file is the single source of truth for feature status.
Update it when any feature moves between states.

---

## How to use this file

Each feature has:
- **Status**: `backlog` | `planned` | `in_progress` | `blocked` | `done` | `deferred`
- **Spec**: link to the feature spec (if exists)
- **Acceptance**: high-level acceptance criteria (from spec.md)
- **Dependencies**: features that must be complete first

When implementing, update the status field inline. Do not create a parallel system.

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `backlog` | Identified but not yet planned or scoped |
| `planned` | Spec and plan exist; ready to implement |
| `in_progress` | Actively being implemented |
| `blocked` | Cannot proceed; blocker documented inline |
| `done` | Implemented, tested, merged |
| `deferred` | Explicitly out of scope for current cycle |

---

## MVP Features

### F-001 · Project Setup & Infrastructure
**Status**: `done`
**Spec**: N/A (setup task)
**Acceptance**:
- Next.js project with TypeScript, Tailwind, ESLint runs locally
- Repo on GitHub with main branch protected
- `.specify/` system initialized with constitution

---

### F-002 · Database & ORM Setup
**Status**: `planned`
**Spec**: [001-rationale-mvp/data-model.md](./001-rationale-mvp/data-model.md)
**Acceptance**:
- Prisma configured with PostgreSQL
- All entities from data-model.md migrated
- `prisma studio` shows all tables
- Prisma client generated and importable

---

### F-003 · Authentication (Better Auth)
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US6
**Dependencies**: F-002
**Acceptance**:
- User can sign up with email and password
- User can log in and log out
- User can reset their password via email
- Protected routes redirect unauthenticated users to login
- Session is workspace-scoped

---

### F-004 · Workspace Creation & Onboarding
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US6
**Dependencies**: F-003
**Acceptance**:
- New user is prompted to create a workspace after signup
- Workspace has a name and auto-generated slug
- User is assigned ADMIN role in their workspace
- Existing users land on their workspace dashboard on login

---

### F-005 · Landing Page
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-001–004
**Acceptance**:
- Hero section communicates value proposition without scrolling
- Before/after section shows scattered context vs structured decision
- Capture / retrieve / review workflow section
- CTA for demo, beta, or example decision
- Sober B2B design; no flashy visuals

---

### F-006 · App Shell & Navigation
**Status**: `planned`
**Dependencies**: F-003, F-004
**Acceptance**:
- Authenticated app has a persistent sidebar with navigation
- Sidebar shows: Dashboard, Decisions, Review Inbox, Search, Settings
- Active workspace name visible in sidebar
- Sidebar is consistent across all app pages

---

### F-007 · Decision CRUD
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US1
**Dependencies**: F-002, F-003, F-004
**Acceptance**:
- User can create a decision with all fields from spec
- Decision is saved with correct status (DECIDED default)
- User can edit any field after creation
- ActivityEntry is created on create and edit
- Decision creation completable in under 2 minutes

---

### F-008 · Decision List View
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-016
**Dependencies**: F-007
**Acceptance**:
- List shows: title, status badge, owner, decision date, review date
- List is scoped to the active workspace
- Empty state shown with CTA when no decisions exist

---

### F-009 · Decision Detail Page
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-011
**Dependencies**: F-007
**Acceptance**:
- Rationale, owner, status, and review date are prominently displayed
- All fields visible: context, alternatives, assumptions, risks, links
- Comments section visible
- Activity log visible

---

### F-010 · Search & Filtering
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US2
**Dependencies**: F-007
**Acceptance**:
- Keyword search across title, summary, rationale
- Filter by status, owner, tag, review date range
- Search results appear within 1 second
- Empty state shown with no results

---

### F-011 · Review Inbox
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US3
**Dependencies**: F-007
**Acceptance**:
- Inbox shows decisions grouped: Overdue, Due Soon (≤7 days), Missing Review Date
- User can reopen, archive, or reschedule from inbox without navigating away
- Actions update decision status immediately

---

### F-012 · Comments
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-015
**Dependencies**: F-009
**Acceptance**:
- User can add a comment to any decision
- Comments show author name and timestamp
- Comment appears without page reload

---

### F-013 · Activity Log
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-014
**Dependencies**: F-007
**Acceptance**:
- Activity log on decision detail shows all create/edit/status change/comment events
- Each entry shows actor, action, and timestamp

---

### F-014 · AI-Assisted Draft
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US4
**Dependencies**: F-007
**Acceptance**:
- User can paste notes and receive a draft with title, summary, rationale pre-filled
- Draft is presented for review before saving — never auto-saved
- User must explicitly confirm or edit before saving
- AI failure shows clear error; user can proceed manually

---

### F-015 · Billing & Subscription (Stripe)
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — US5
**Dependencies**: F-003, F-004
**Acceptance**:
- Free tier requires no Stripe record
- Admin can initiate upgrade via Stripe Checkout
- Subscription status synced via webhook
- Billing page shows current plan and management link
- Subscription status visible to all workspace members in settings

---

### F-016 · Settings Pages
**Status**: `planned`
**Dependencies**: F-003, F-004, F-015
**Acceptance**:
- Settings page shows workspace info and member list
- Billing section shows subscription status and upgrade/manage CTA
- Non-admin members see subscription status but cannot modify it

---

### F-017 · Pricing Page
**Status**: `planned`
**Spec**: [001-rationale-mvp/spec.md](./001-rationale-mvp/spec.md) — FR-001
**Dependencies**: F-005
**Acceptance**:
- Public pricing page shows free and pro plan comparison
- CTA links to signup or upgrade depending on auth state

---

## Post-MVP (Deferred)

| Feature | Status | Notes |
|---------|--------|-------|
| Email/push reminders | `deferred` | MVP uses in-app review inbox only |
| Social login (Google, GitHub) | `deferred` | Email/password sufficient for MVP |
| Multi-workspace per user | `deferred` | Single workspace per user for MVP |
| Fine-grained permissions | `deferred` | Admin vs Member is sufficient |
| Full version diffing + restore | `deferred` | Activity log is sufficient for MVP |
| Slack / Jira / Notion integrations | `deferred` | Post-product-market-fit |
| Multi-seat / org-level billing | `deferred` | Single user subscription for MVP |
| Audio/video transcription | `deferred` | Out of scope permanently for current vision |
| pg_trgm / tsvector search upgrade | `deferred` | Upgrade when >10k decisions/workspace |
| Annual billing / pricing toggle | `deferred` | Single monthly plan for MVP |
