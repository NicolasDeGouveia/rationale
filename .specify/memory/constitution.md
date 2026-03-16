<!--
SYNC IMPACT REPORT
==================
Version change: none (initial) → 1.0.0
Modified principles: N/A (initial authoring from template)
Added sections:
  - Core Principles (7 principles)
  - Design & UX Standards
  - Delivery & Roadmap
  - Governance
Templates reviewed:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check section present)
  - .specify/templates/spec-template.md ✅ aligned (user stories, acceptance criteria, entities)
  - .specify/templates/tasks-template.md ✅ aligned (phase structure, parallel tasks, story mapping)
  - .specify/templates/commands/ ⚠ directory not found — no command files to update
Deferred TODOs:
  - None. All fields resolved from user-supplied context.
-->

# Rationale Constitution

## Core Principles

### I. Code Quality

Code MUST be clean, readable, modular, and easy to refactor. Every file and function
must be understandable by another developer within minutes of reading it.

- Prefer simple, explicit implementations over clever abstractions.
- MUST NOT introduce unnecessary dependencies. Every package added must justify its value.
- Business logic MUST be separated from UI concerns. Services and data-access layers
  are kept outside of React components.
- Domain concepts MUST use consistent naming throughout the codebase:
  `decision`, `review`, `rationale`, `assumption`, `owner`, `status`,
  `subscription`, `billing`, `featureStatus`.
- Structure MUST support future growth without adding complexity to the MVP.
  Premature abstractions are forbidden.

### II. Testing Standards

Critical user flows MUST be testable and covered before non-critical ones.
Tests MUST be fast, deterministic, and meaningful.

- Test coverage MUST prioritize business logic over cosmetic or layout behavior.
- At minimum, the following flows MUST have test coverage:
  - Decision creation and editing
  - Search and filtering
  - Review reminder logic
  - Subscription state handling
  - Billing access control
  - Permission boundaries
- Tests MUST NOT be fragile or tightly coupled to implementation details.
  Prefer testing behavior and outcomes over internal structure.
- Bug fixes MUST include a regression test where the failure is reproducible.

### III. User Experience Consistency

The product MUST feel calm, clear, and structured across every surface.

- UI MUST be consistent across landing pages, authenticated app pages, billing pages,
  and settings. A unified design language is non-negotiable.
- Actions MUST be predictable and labels MUST be easy to understand without
  product knowledge.
- Decision creation MUST be completable in under 2 minutes. Forms MUST minimize friction.
- The following are core product moments and MUST feel polished:
  search, review reminders, billing state feedback, and decision detail pages.
- The product MUST clearly surface: decision status, ownership, rationale,
  review date, and subscription status.
- AI-assisted features MUST always be human-reviewed. AI output MUST NOT silently
  publish or modify critical content.

### IV. Performance

Pages MUST load quickly and feel responsive on common laptop screens under
normal MVP-scale datasets (dozens to hundreds of decisions per workspace).

- Navigation and search MUST feel fast without pagination hacks or skeleton abuse.
- Client-side rendering complexity MUST be kept minimal.
  Avoid unnecessary client components in Next.js App Router.
- Bundle size MUST be kept small. Only add libraries that provide clear,
  measurable value.
- Expensive operations (AI generation, search indexing) MUST be isolated,
  run asynchronously, and not block the main user flow.

### V. Product Philosophy

Build the smallest product that solves the core problem well.
Rationale is decision memory for teams — not a wiki, note-taking tool,
or meeting recorder.

The MVP MUST answer exactly four questions:

1. What was decided?
2. Why was it decided?
3. Who owns it?
4. When should it be reviewed?

- Features that improve retrieval, clarity, and revalidation are prioritized.
- Advanced integrations, enterprise features, and broad automation MUST be deferred
  until the core decision workflow is proven and stable.
- Any feature that does not map to a user pain point, activation goal, retention goal,
  or revenue goal MUST NOT be built in the MVP.

### VI. Design Principles

Use a sober, modern B2B interface. The visual language communicates structure,
not personality.

- Prefer clarity, whitespace, typographic hierarchy, and consistent spacing.
- MUST NOT use flashy visuals, unnecessary gradients, or generic AI aesthetics.
- Visual language MUST be based on structure primitives: decision cards, timelines,
  review states, and status indicators.
- Landing page visuals MUST explain the product — not decorate it.
- Design language MUST be unified across landing page, authenticated app,
  settings, and billing pages.

### VII. Delivery and Roadmap

Ship incrementally in small, testable slices. Optimize for speed of iteration
and product learning.

- A single codebase MUST be used for both the landing page and the authenticated app
  unless a concrete technical reason emerges to separate them.
- Every feature MUST have a status: `backlog`, `planned`, `in-progress`,
  `blocked`, `done`, or `deferred`.
- The project MUST maintain a centralized feature roadmap and implementation
  tracking system. This system MUST be kept up to date as features are completed.
- Implementation MUST update roadmap and task tracking as work progresses.
- Work MUST be organized so future implementation can proceed with minimal human
  intervention, while still respecting scope boundaries and acceptance criteria defined
  in spec.md files.

## Design & UX Standards

These standards complement Principle VI and apply to all implementation work.

- **Typography**: Use a limited type scale (3–4 sizes). Font weight and size
  carry hierarchy — color alone MUST NOT.
- **Color**: A neutral base palette with a single accent color. Status colors
  (warning, error, success) MUST be used consistently and accessibly.
- **Spacing**: Use a consistent spacing scale (e.g., 4px base unit via Tailwind).
  Do not introduce one-off spacing values.
- **Components**: Reuse UI primitives. Do not build a new component when an
  existing one can be adapted.
- **Empty states**: Every list or data surface MUST have a meaningful empty state
  that guides the user toward the next action.
- **Feedback**: Every user action that modifies data MUST produce visible feedback
  (success, error, or loading state).

## Delivery & Roadmap

These standards operationalize Principle VII and define how roadmap tracking
is maintained.

- **Feature specs** live in `/specs/[###-feature-name]/spec.md`.
- **Implementation plans** live in `/specs/[###-feature-name]/plan.md`.
- **Task lists** live in `/specs/[###-feature-name]/tasks.md`.
- Feature status MUST be updated in the roadmap document when a feature moves
  between states.
- Commits related to a feature SHOULD reference the feature branch name.
- The roadmap MUST be the single source of truth for what is planned, in progress,
  and done. Verbal agreements or undocumented decisions are insufficient.

## Governance

This constitution supersedes all other project practices, conventions, and
verbal agreements. Amendments require a documented rationale, a version bump,
and propagation to affected templates.

**Amendment procedure**:

1. Propose the amendment with rationale in writing.
2. Update this file following semantic versioning:
   - MAJOR: Backward-incompatible governance or principle removal/redefinition.
   - MINOR: New principle or section added or materially expanded.
   - PATCH: Clarifications, wording fixes, non-semantic refinements.
3. Update the Sync Impact Report comment at the top of this file.
4. Propagate changes to affected templates in `.specify/templates/`.
5. Commit with message: `docs: amend constitution to vX.Y.Z (<summary>)`.

**Compliance**: All PRs and specification reviews MUST verify alignment with
this constitution before merging. Complexity violations MUST be documented in
the plan's Complexity Tracking table with explicit justification.

**Runtime guidance**: Use `.specify/memory/` for project-level memory and
`.specify/templates/` for reusable spec artifacts.

---

**Version**: 1.0.0 | **Ratified**: 2026-03-16 | **Last Amended**: 2026-03-16
