# Research: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16
**Phase**: 0 — All NEEDS CLARIFICATION resolved

---

## 1. Authentication Library

**Decision**: Better Auth (v1.5.x)

**Rationale**:
- NextAuth.js v5 is in maintenance-only mode; its own team now recommends Better Auth
  for new projects.
- Lucia Auth is officially deprecated (late 2024) — hard no for a new project.
- Custom iron-session would require building email/password hashing, password reset,
  session invalidation, and workspace membership tables entirely from scratch —
  several weeks of work with a large security surface area.
- Better Auth is the only actively maintained library that covers all MVP requirements
  out of the box: email/password signup/login, built-in password reset, server-side
  sessions with true invalidation, first-class Prisma adapter (CLI-generated schema),
  and an Organizations plugin that maps directly to workspace-scoped membership.

**Alternatives considered**:
- NextAuth v5 — maintenance-only, credential provider needs manual hashing and reset
- Lucia Auth — deprecated, do not use
- iron-session — primitive only; would require full auth layer implementation

**Key implementation notes**:
- Run `npx auth generate` to produce the Prisma schema additions
- Use the `emailPassword` plugin for signup/login/reset
- Use the `organization` plugin for workspace membership and roles
- Wire `middleware.ts` to Better Auth's session check for protected routes
- Need an email transport (Resend recommended) for password reset emails

---

## 2. Stripe Billing Flow

**Decision**: Stripe Checkout + Stripe Billing Portal (fully hosted surfaces)

**Rationale**:
- Zero PCI scope; no custom payment UI
- Stripe Checkout handles the upgrade flow; Stripe Billing Portal handles
  plan management, cancellation, and invoice history
- Idiomatic for B2B SaaS MVP with a single paid tier

**Webhook events to handle** (4 core events):

| Event | Action |
|---|---|
| `checkout.session.completed` | Upsert Subscription row; set status to `active` or `trialing` |
| `customer.subscription.updated` | Update `status`, `currentPeriodEnd`, `cancelAtPeriodEnd`, `stripePriceId` |
| `customer.subscription.deleted` | Set `status = canceled`; revoke paid-tier access |
| `invoice.payment_failed` | Set `status = past_due` |

**DB fields required on `Subscription` model**:
- `stripeCustomerId` (also store on `User` for Billing Portal sessions)
- `stripeSubscriptionId`
- `stripePriceId`
- `status` (mirror Stripe enum: `trialing | active | past_due | canceled | incomplete | unpaid`)
- `currentPeriodStart`, `currentPeriodEnd`
- `cancelAtPeriodEnd` (Boolean)
- `trialStart?`, `trialEnd?`

**Access gating rule**: `status IN (active, trialing) AND currentPeriodEnd > now()`
For `past_due`: grant a grace period (3–7 days) before revoking access.

**Webhook handler location**: `src/app/api/webhooks/stripe/route.ts`
Use `req.text()` for raw body — never `req.json()` — to preserve Stripe signature.

**MVP simplifications**:
- Flat-rate subscription only; no metered/usage billing
- One paid tier; no upgrade/downgrade path needed
- No multi-seat billing (org-level billing is post-MVP)
- Free tier = no Subscription row in DB

---

## 3. Folder Structure

**Decision**: Next.js App Router with `(marketing)` and `(app)` route groups,
domain logic under `src/server/`, shared UI under `src/components/`.

**Rationale**:
- Route groups give each surface its own layout (marketing nav vs. app sidebar)
  without affecting URLs
- `src/server/` with `import "server-only"` guards enforce the client/server boundary
- Three-layer server stack (data-access → services → actions) prevents Server Actions
  from becoming untestable monoliths
- Zod schemas in `src/lib/validations/` serve both server-side validation and
  client-side form validation from a single source of truth

**Final structure**: See plan.md Project Structure section.

---

## 4. Search Strategy

**Decision**: Prisma `contains` with `mode: 'insensitive'` (multi-field OR query)

**Rationale**:
- Under 1,000 decision records per workspace, a multi-field ILIKE scan completes in
  under 5ms — no index, no extension, no raw SQL needed
- Zero setup cost; fully type-safe via Prisma generated client
- Readable and maintainable; no operational overhead

**Migration path (when to upgrade)**:
- Exceed ~10,000 records per workspace → migrate to stored `tsvector` generated column
  + GIN index via a single SQL migration
- Partial/prefix matching becomes a product requirement → add `pg_trgm` extension

**Alternatives rejected**:
- `fullTextSearch` Prisma preview feature — unstable API, no upgrade path to indexed search
- pg_trgm — solves a problem (partial matching) not currently required
- External search (Algolia, Meilisearch, Typesense) — overkill at MVP scale; adds
  infrastructure and sync complexity before the product has users
