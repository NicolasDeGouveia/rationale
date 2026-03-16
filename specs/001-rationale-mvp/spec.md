# Feature Specification: Rationale MVP

**Feature Branch**: `001-rationale-mvp`
**Created**: 2026-03-16
**Status**: Draft

## Overview

Rationale is a B2B SaaS application that acts as "decision memory for teams."
Teams make important decisions every day in meetings, Slack threads, documents, and
emails — but the reasoning behind those decisions is rarely preserved. Over time,
this leads to repeated debates, slow onboarding, inconsistent execution, and
confusion about past choices.

Rationale gives teams a structured place to capture, store, retrieve, and review
decisions. The core promise is: **don't lose the why behind your team's decisions.**

The MVP answers exactly four questions for every decision:
1. What was decided?
2. Why was it decided?
3. Who owns it?
4. When should it be reviewed?

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Structured Decision Record (Priority: P1)

A team member opens Rationale and creates a new decision manually. They fill in the
title, summary, rationale, context, owner, and optionally a review date. They save the
decision, which is immediately visible in the team's decision list.

**Why this priority**: This is the atomic unit of the entire product. Without the
ability to create a decision, nothing else is possible. It must be frictionless and
completable in under 2 minutes.

**Independent Test**: A user can create a complete decision record from scratch and
immediately find it in the decision list. The decision shows all entered fields and
its status is "Decided".

**Acceptance Scenarios**:

1. **Given** a logged-in user on the decision list, **When** they click "New Decision"
   and complete the required fields and save, **Then** the decision appears in the list
   with correct title, owner, status, and decision date.
2. **Given** a user creating a decision, **When** they leave required fields empty
   and try to save, **Then** the form shows clear validation errors and does not save.
3. **Given** a user creating a decision, **When** they set a review date and save,
   **Then** the review date is visible on the decision card and in the decision detail.
4. **Given** a saved decision, **When** a team member opens it, **Then** they can
   read the full rationale, context, alternatives considered, assumptions, and risks.

---

### User Story 2 - Search and Retrieve Previous Decisions (Priority: P2)

A team member needs to find an old decision. They use the search bar to search by
keyword. The results show matching decisions with enough context to understand why
each was made without opening each one individually.

**Why this priority**: Search is the primary retrieval mechanism. If teams cannot
quickly find and understand past decisions, the product fails its core promise.

**Independent Test**: A user can type a keyword into search and see a list of
matching decisions with titles, summaries, and statuses visible in the results,
without needing to open each one.

**Acceptance Scenarios**:

1. **Given** a workspace with multiple saved decisions, **When** a user searches
   by a keyword found in a decision's title or rationale, **Then** matching decisions
   appear in results within one second of typing.
2. **Given** search results, **When** a user clicks a result, **Then** they are
   taken directly to the decision detail page.
3. **Given** a search with no matches, **When** the user submits the query,
   **Then** a clear empty state is shown with a suggestion to create a new decision.
4. **Given** a decision list, **When** a user applies a filter (by status, tag, or
   owner), **Then** only decisions matching the filter criteria are displayed.

---

### User Story 3 - Review and Revisit Decisions (Priority: P3)

A user receives an in-app notification that a decision's review date has arrived or
is approaching. They open the review inbox, see decisions that need attention,
and can re-open, archive, or reschedule the review date for each one.

**Why this priority**: Review and revalidation is what differentiates Rationale from
a static document store. Without it, decisions become stale and the product loses
long-term value.

**Independent Test**: A user can open the review inbox, see at least one decision
categorized as overdue or due soon, and take an action (reopen, archive, or
reschedule) that updates the decision's state immediately.

**Acceptance Scenarios**:

1. **Given** a decision whose review date has passed, **When** a user opens the
   review inbox, **Then** that decision appears in the "Overdue" section.
2. **Given** a decision whose review date is within 7 days, **When** a user opens
   the review inbox, **Then** it appears in the "Due Soon" section.
3. **Given** a decision in the review inbox, **When** a user clicks "Reopen",
   **Then** the decision status changes to "Reopened" and it moves out of the inbox.
4. **Given** a decision in the review inbox, **When** a user clicks "Archive",
   **Then** the decision status changes to "Archived" and is removed from the inbox.
5. **Given** a decision in the review inbox, **When** a user reschedules the review
   date, **Then** the decision leaves the inbox and reappears at the new date.

---

### User Story 4 - AI-Assisted Draft from Meeting Notes (Priority: P4)

A user pastes raw meeting notes or discussion text into a drafting interface.
The system generates a structured draft decision (title, summary, rationale,
assumptions) which the user reviews, edits, and optionally saves as a decision.
The AI output is never saved without explicit user approval.

**Why this priority**: This reduces the friction of creating decisions from existing
content and is a key differentiator. However, it requires the core creation flow
to be solid first.

**Independent Test**: A user pastes a paragraph of meeting notes, receives a
draft with at least title, summary, and rationale populated, makes an edit, and
saves it — the saved decision reflects the user's edited version, not the raw
AI output.

**Acceptance Scenarios**:

1. **Given** a user on the new decision page, **When** they paste text into the
   AI drafting input and submit, **Then** a draft decision is generated with
   title, summary, and rationale pre-filled within a reasonable wait time.
2. **Given** an AI-generated draft, **When** the user edits any field, **Then**
   their edits take precedence and the AI suggestions are discarded for that field.
3. **Given** an AI-generated draft, **When** the user saves without reviewing,
   **Then** the system requires explicit confirmation before saving.
4. **Given** an AI generation attempt that fails, **When** the error occurs,
   **Then** the user sees a clear error message and can continue manually.

---

### User Story 5 - Billing and Subscription Management (Priority: P5)

A workspace admin views the current subscription plan, upgrades to a paid tier,
or manages their billing details. Subscription status is visible in the app and
determines access to certain features.

**Why this priority**: Billing is required for a paid launch. It is lower priority
than the core decision workflows since it supports monetization, not the primary
user value.

**Independent Test**: A workspace admin can view the current plan, initiate an
upgrade to a paid plan via a payment flow, and see the updated subscription status
reflected in the application immediately after payment.

**Acceptance Scenarios**:

1. **Given** a workspace on the free tier, **When** an admin visits the billing
   page, **Then** they can see the current plan, its limits, and an option to upgrade.
2. **Given** an admin clicking "Upgrade", **When** they complete the payment flow,
   **Then** the workspace subscription status updates and the app reflects the new plan.
3. **Given** a workspace on a paid plan, **When** a non-admin member views settings,
   **Then** they can see the subscription status but cannot modify it.
4. **Given** a failed payment, **When** it occurs, **Then** the admin is notified
   and billing management is accessible to resolve the issue.

---

### User Story 6 - Authentication and Workspace Setup (Priority: P1 — prerequisite)

A new user signs up, creates or joins a workspace, and is brought to the decision
list. Authentication is secure and workspace-scoped: users only see their workspace's
decisions.

**Why this priority**: Authentication and workspace isolation are prerequisites for
all other stories. Without them, no other flow is secure or meaningful.

**Independent Test**: A user can sign up, complete workspace creation, and land on
an empty decision list that belongs only to their workspace.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they sign up with a valid email and password,
   **Then** their account is created and they are prompted to create or join a workspace.
2. **Given** a new workspace, **When** the user completes setup, **Then** they land
   on an empty decision list scoped to that workspace.
3. **Given** an existing user, **When** they log in, **Then** they are taken directly
   to their workspace decision list.
4. **Given** an unauthenticated user, **When** they attempt to access any app route,
   **Then** they are redirected to the login page.

---

### Edge Cases

- A user attempts to create a decision with only a title and no rationale — the system
  allows saving as "Draft" status but shows a prompt to complete the rationale.
- A decision's review date is set to a past date during creation — the system warns
  the user and asks to confirm or correct the date.
- Two users edit the same decision simultaneously — the last save wins; no silent
  data loss occurs and the activity log reflects both edits.
- A workspace admin deletes their account — ownership of decisions must be
  reassigned or the workspace must be transferred before deletion is allowed.
- A user searches with special characters or an empty query — the system handles
  gracefully without errors or blank screens.
- AI generation returns an empty or malformed response — the user sees an error and
  can proceed manually without losing their input.
- A Stripe webhook arrives for a billing event when the workspace is not found —
  the event is logged and does not crash the application.

---

## Requirements *(mandatory)*

### Functional Requirements

**Landing Page**

- **FR-001**: The landing page MUST communicate the core value proposition within
  the hero section without requiring scrolling.
- **FR-002**: The landing page MUST include a call-to-action for demo requests,
  beta access, or viewing an example decision.
- **FR-003**: The landing page MUST visually demonstrate the difference between
  scattered context and a structured decision record.
- **FR-004**: The landing page MUST be accessible to unauthenticated visitors and
  not require login to view.

**Authentication & Workspace**

- **FR-005**: The system MUST support user registration via email and password.
- **FR-006**: The system MUST support user login and session management with
  standard security practices (HTTPS, secure cookies, session expiry).
- **FR-007**: Users MUST be able to reset their password via email.
- **FR-008**: Each user MUST belong to at least one workspace. Decisions are
  scoped to a workspace and not visible across workspaces.
- **FR-009**: A user MUST be able to create a new workspace during onboarding.
- **FR-010**: Workspace members MUST have at least two roles: admin and member.
  Admins can manage billing and workspace settings.

**Decision Management**

- **FR-011**: Users MUST be able to create a decision record with the following
  fields: title (required), summary, context, rationale, alternatives considered,
  assumptions, risks, owner (required), participants, decision date, review date,
  tags, and related links.
- **FR-012**: Decisions MUST have one of four statuses: Draft, Decided, Reopened,
  Archived. The default status on creation is Decided.
- **FR-013**: Users MUST be able to edit any field of a decision they have access to.
- **FR-014**: The system MUST record an activity log entry for every create, edit,
  status change, and comment on a decision.
- **FR-015**: Users MUST be able to add comments to a decision.
- **FR-016**: Decisions MUST be listed in a view that shows title, status, owner,
  decision date, and review date at a glance.

**Search & Filtering**

- **FR-017**: Users MUST be able to search decisions by keyword across title,
  summary, and rationale fields.
- **FR-018**: Users MUST be able to filter the decision list by status, owner,
  tag, and review date range.

**Review Inbox**

- **FR-019**: The system MUST display a review inbox containing decisions grouped
  by urgency: Overdue, Due Soon (within 7 days), and Missing Review Date.
- **FR-020**: From the review inbox, users MUST be able to reopen, archive, or
  reschedule the review date of any listed decision without leaving the inbox.

**AI-Assisted Drafting**

- **FR-021**: Users MUST be able to paste unstructured text (meeting notes,
  discussion threads) and receive an AI-generated draft decision.
- **FR-022**: The AI-generated draft MUST be presented as editable fields before
  any save action is taken. The system MUST NOT auto-save AI output.
- **FR-023**: Users MUST explicitly confirm or edit the draft before saving.

**Billing & Subscription**

- **FR-024**: The system MUST support a free tier and at least one paid tier.
- **FR-025**: Workspace admins MUST be able to initiate, manage, and cancel a
  subscription via a billing page within the application.
- **FR-026**: The current subscription plan and status MUST be visible to all
  workspace members in settings.
- **FR-027**: Subscription status MUST be stored and accessible in the application
  state to enable future feature gating.
- **FR-028**: The payment flow MUST be handled by Stripe. No raw payment data is
  stored by Rationale.

---

### Key Entities

- **User**: A person with a verified account. Has an email, password hash,
  display name. Belongs to one or more workspaces with a role per workspace.

- **Workspace**: The organizational unit. All decisions belong to a workspace.
  Has a name, owner (admin), subscription status, and billing reference.

- **Decision**: The core record. Has title, summary, context, rationale,
  alternatives, assumptions, risks, owner (user reference), participants (list of
  user references), decision date, review date, status (Draft / Decided / Reopened /
  Archived), tags, related links, and timestamps.

- **Comment**: A threaded message attached to a decision. Has author, content,
  and timestamp.

- **ActivityEntry**: An audit log entry for a decision. Records the actor, action
  type, changed fields, and timestamp.

- **Subscription**: Billing and plan state for a workspace. Has plan tier,
  status (active, past_due, canceled, trialing), Stripe customer ID, and
  renewal date.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a complete decision record in under 2 minutes from
  the moment they click "New Decision" to the moment the decision is saved.
- **SC-002**: A user can find a previously saved decision using a keyword search
  in under 30 seconds.
- **SC-003**: The review inbox loads and displays all overdue and due-soon decisions
  without requiring any additional navigation.
- **SC-004**: An AI-generated draft populates at least the title, summary, and
  rationale fields from pasted notes. The user must not need to re-enter information
  already present in the source text.
- **SC-005**: A workspace admin can complete a subscription upgrade from the billing
  page through to confirmed payment without leaving the application.
- **SC-006**: Subscription status changes are reflected in the application within
  one page load after the billing event is processed.
- **SC-007**: The landing page communicates the core value proposition to a new
  visitor who has never heard of Rationale, without requiring them to scroll past
  the hero section.
- **SC-008**: The product clearly differentiates from a generic note-taking tool:
  every decision surface prominently shows rationale, owner, status, and review date.
- **SC-009**: The feature roadmap is centralized in the codebase and any new
  feature can be located and its status determined in under 60 seconds.

---

## Assumptions

- Email and password authentication is sufficient for the MVP. Social login (Google,
  GitHub) is deferred.
- A single workspace per user is sufficient for the MVP. Multi-workspace switching
  is deferred.
- Review reminders are surfaced in-app via the review inbox. Email reminders are
  a post-MVP enhancement.
- AI drafting uses a server-side LLM API call. The specific provider is a technical
  implementation decision.
- Stripe Checkout or Stripe Billing Portal is used for the payment flow. Custom
  payment UI is not required for MVP.
- Role permissions for the MVP are limited to admin vs. member. Fine-grained
  per-decision permissions are deferred.
- Revision history for the MVP means an activity log. Full version diffing with
  restore is deferred.

---

## Out of Scope for MVP

- Audio and video transcription
- Deep enterprise permissions (SSO, SCIM, domain restrictions)
- Integrations with external tools (Slack, Jira, Notion, etc.)
- Full project management features (assignable tasks, milestones)
- Nested workspaces, knowledge bases, or wiki structures
- Autonomous AI agents taking actions without explicit user approval
- Email or push notification reminders (in-app review inbox only)
- Multi-workspace support per user
- Social or SSO login
- Full version diffing and restore of past decision states
