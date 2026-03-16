# rationale Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-16

## Active Technologies

- TypeScript 5.x / Node.js 20+ + Next.js 16, React 19, Prisma 6, Better Auth 1.5.x, (001-rationale-mvp)

## Project Structure

```text
src/
├── app/
│   ├── (marketing)/   # Public landing, pricing, demo — no auth
│   ├── (auth)/        # Login, signup pages
│   ├── (app)/         # Authenticated app — sidebar layout
│   └── api/           # Route handlers: auth + stripe webhook
├── components/
│   ├── ui/            # Primitive design-system components
│   ├── marketing/     # Landing page sections
│   └── app/           # App shell components (sidebar, cards, badges)
├── lib/               # Pure utilities + Zod schemas
├── server/            # Server-only (import "server-only")
│   ├── auth.ts        # Better Auth instance
│   ├── db/            # Prisma singleton
│   ├── data-access/   # Raw Prisma queries per entity
│   ├── services/      # Business logic
│   └── actions/       # Server Actions (thin orchestrators)
├── types/             # Domain DTOs (no Prisma types in UI)
└── middleware.ts      # Auth protection for (app) routes

prisma/
├── schema.prisma
└── migrations/

specs/
├── roadmap.md         # Centralized feature roadmap — single source of truth
└── 001-rationale-mvp/ # MVP spec, plan, data model, contracts

tests/
├── unit/              # Vitest: service business logic
└── e2e/               # Playwright: critical user flows
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest unit tests
npx prisma generate  # Regenerate Prisma client
npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma studio    # Open DB browser
```

## Code Style

- All server-only files MUST start with `import "server-only"`
- Server Actions are thin: validate (Zod) → call service → return ActionResult<T>
- Services own business logic; data-access files own Prisma queries
- UI components receive clean DTOs from `src/types/` — never raw Prisma types
- Zod schemas in `src/lib/validations/` are the single source of truth for validation
- Domain entity names: decision, review, rationale, assumption, owner, status,
  subscription, billing, workspace, featureStatus

## Recent Changes

- 001-rationale-mvp: Added TypeScript 5.x / Node.js 20+ + Next.js 16, React 19, Prisma 6, Better Auth 1.5.x,

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
