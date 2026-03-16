# Data Model: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16

---

## Entity Overview

```
User ─────────────── WorkspaceMembership ─── Workspace
 │                                                │
 │                                         Subscription
 │                                                │
 └── Decision (owner) ──────────────────── Workspace
          │
          ├── Comment
          ├── ActivityEntry
          ├── Reminder
          ├── DecisionAlternative
          ├── DecisionAssumption
          ├── DecisionRisk
          ├── DecisionTag ─── Tag
          └── DecisionLink
```

---

## Prisma Schema

```prisma
// ─── Auth (Better Auth generated — do not edit manually) ────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  emailVerified Boolean  @default(false)
  name          String?
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Better Auth relations
  sessions      Session[]
  accounts      Account[]

  // App relations
  stripeCustomerId  String?   @unique
  memberships       WorkspaceMembership[]
  ownedDecisions    Decision[]     @relation("DecisionOwner")
  comments          Comment[]
  activityEntries   ActivityEntry[]
  reminders         Reminder[]
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@unique([providerId, accountId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ─── Workspace ───────────────────────────────────────────────────────────────

model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships  WorkspaceMembership[]
  decisions    Decision[]
  subscription Subscription?
  tags         Tag[]
}

model WorkspaceMembership {
  id          String          @id @default(cuid())
  role        WorkspaceRole   @default(MEMBER)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  userId      String
  workspaceId String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}

enum WorkspaceRole {
  ADMIN
  MEMBER
}

// ─── Subscription / Billing ──────────────────────────────────────────────────

model Subscription {
  id                   String             @id @default(cuid())
  workspaceId          String             @unique
  workspace            Workspace          @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  stripeCustomerId     String             @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  stripeProductId      String?

  status               SubscriptionStatus @default(TRIALING)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean            @default(false)
  trialStart           DateTime?
  trialEnd             DateTime?

  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
  INCOMPLETE_EXPIRED
  UNPAID
}

// ─── Decision ────────────────────────────────────────────────────────────────

model Decision {
  id           String         @id @default(cuid())
  workspaceId  String
  workspace    Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  title        String
  summary      String?
  context      String?
  rationale    String?

  status       DecisionStatus @default(DECIDED)
  ownerId      String
  owner        User           @relation("DecisionOwner", fields: [ownerId], references: [id])
  participants String[]       // Array of user IDs (denormalized for MVP simplicity)

  decisionDate DateTime?
  reviewDate   DateTime?

  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  alternatives DecisionAlternative[]
  assumptions  DecisionAssumption[]
  risks        DecisionRisk[]
  tags         DecisionTag[]
  links        DecisionLink[]
  comments     Comment[]
  activity     ActivityEntry[]
  reminders    Reminder[]
}

enum DecisionStatus {
  DRAFT
  DECIDED
  REOPENED
  ARCHIVED
}

model DecisionAlternative {
  id          String   @id @default(cuid())
  decisionId  String
  decision    Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  title       String
  description String?
  rejected    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model DecisionAssumption {
  id         String   @id @default(cuid())
  decisionId String
  decision   Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  content    String
  createdAt  DateTime @default(now())
}

model DecisionRisk {
  id         String   @id @default(cuid())
  decisionId String
  decision   Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  content    String
  createdAt  DateTime @default(now())
}

// ─── Tags ────────────────────────────────────────────────────────────────────

model Tag {
  id          String        @id @default(cuid())
  workspaceId String
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  name        String
  decisions   DecisionTag[]

  @@unique([workspaceId, name])
}

model DecisionTag {
  decisionId String
  tagId      String
  decision   Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([decisionId, tagId])
}

// ─── Related Links ───────────────────────────────────────────────────────────

model DecisionLink {
  id         String   @id @default(cuid())
  decisionId String
  decision   Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  url        String
  label      String?
  createdAt  DateTime @default(now())
}

// ─── Comments ────────────────────────────────────────────────────────────────

model Comment {
  id         String   @id @default(cuid())
  decisionId String
  decision   Decision @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  content    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ─── Activity Log ────────────────────────────────────────────────────────────

model ActivityEntry {
  id         String       @id @default(cuid())
  decisionId String
  decision   Decision     @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  actorId    String
  actor      User         @relation(fields: [actorId], references: [id])
  action     ActivityAction
  metadata   Json?        // Changed fields, old/new values for edits
  createdAt  DateTime     @default(now())
}

enum ActivityAction {
  CREATED
  UPDATED
  STATUS_CHANGED
  COMMENTED
  REVIEW_RESCHEDULED
  ARCHIVED
  REOPENED
}

// ─── Reminders ───────────────────────────────────────────────────────────────

model Reminder {
  id         String         @id @default(cuid())
  decisionId String
  decision   Decision       @relation(fields: [decisionId], references: [id], onDelete: Cascade)
  userId     String
  user       User           @relation(fields: [userId], references: [id])
  dueAt      DateTime
  status     ReminderStatus @default(PENDING)
  createdAt  DateTime       @default(now())
}

enum ReminderStatus {
  PENDING
  DISMISSED
  ACTIONED
}

// ─── Feature Roadmap ─────────────────────────────────────────────────────────
// Stored in code (specs/roadmap.md), not in the database.
// See specs/roadmap.md for the centralized feature tracking system.
```

---

## Key Design Decisions

### participants as String[]
For MVP, decision participants are stored as a denormalized array of user IDs on the
Decision row. This avoids a `DecisionParticipant` join table that adds complexity
without user-visible benefit at MVP scale. Migrate to a join table when participant
display names need to be queried or when participants need notification features.

### Workspace membership vs Better Auth Organizations
Better Auth's `organization` plugin would generate its own `organization`, `member`,
and `invitation` tables. For Rationale, we use a simpler custom `Workspace` +
`WorkspaceMembership` model that maps cleanly to domain language and avoids coupling
the app to Better Auth's organization schema. Better Auth sessions carry the active
workspace context via a custom session field.

### Feature Roadmap not in DB
The feature roadmap and feature status tracking lives in `specs/roadmap.md` — a
Markdown file in the repository. It is not a database table. This follows the
principle that implementation tooling should live in the codebase, not in the
running product's database.

### Status Enums
Both `DecisionStatus` and `SubscriptionStatus` use PostgreSQL enums via Prisma.
Stripe's subscription status values are mirrored exactly to avoid a mapping layer.

---

## State Transitions

### Decision Status

```
DRAFT → DECIDED → REOPENED → DECIDED (cycle)
           └──────────────────→ ARCHIVED
DRAFT → ARCHIVED
REOPENED → ARCHIVED
```

### Subscription Status (Stripe-driven)

```
(none) → TRIALING → ACTIVE → PAST_DUE → CANCELED
                  → CANCELED
                  → PAST_DUE → ACTIVE (payment retry succeeds)
```
