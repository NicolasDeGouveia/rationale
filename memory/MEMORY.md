# Rationale Project Memory

## Project Overview
- **Name**: Rationale — "decision memory for teams" B2B SaaS
- **Stack**: Next.js 16, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL (Neon), Better Auth, Stripe
- **Repo**: https://github.com/NicolasDeGouveia/rationale
- **Branch**: main (MVP work on branch `001-rationale-mvp`)

## Key Files
- `specs/roadmap.md` — centralized feature roadmap (single source of truth)
- `specs/001-rationale-mvp/spec.md` — MVP product specification
- `specs/001-rationale-mvp/plan.md` — technical architecture plan
- `specs/001-rationale-mvp/data-model.md` — Prisma schema
- `specs/001-rationale-mvp/contracts/server-actions.md` — Server Action contracts
- `specs/001-rationale-mvp/quickstart.md` — dev setup guide
- `.specify/memory/constitution.md` — project constitution v1.0.0
- `CLAUDE.md` — agent context (auto-updated by .specify scripts)

## Architecture Decisions
- Route groups: `(marketing)`, `(auth)`, `(app)` — no URL impact
- Auth: Better Auth 1.5.x with emailPassword + organization plugins + Prisma adapter
- Billing: Stripe Checkout + Billing Portal (hosted); webhook at `/api/webhooks/stripe`
- Search: Prisma `contains` + `mode: insensitive` (upgrade to tsvector at >10k records)
- Server-only code: `src/server/` with `import "server-only"` guards
- Layer order: data-access → services → Server Actions → Server Components → Client Components

## Feature Roadmap Status (as of 2026-03-16)
- F-001 Project Setup: `done`
- F-002 to F-017: `planned`
- Next step: `/speckit.tasks` to generate tasks.md

## Known Bugs / Future Fixes
- **Avant mise en prod** : changer l'expéditeur Resend de `onboarding@resend.dev` vers `Rationale <noreply@rationale.app>` dans `src/server/auth.ts` (emailVerification.sendVerificationEmail). Nécessite de vérifier le domaine `rationale.app` dans le dashboard Resend → Domains.
