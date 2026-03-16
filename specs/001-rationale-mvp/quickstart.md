# Quickstart: Rationale MVP

**Branch**: `001-rationale-mvp` | **Date**: 2026-03-16

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local or Neon)
- Stripe account (test mode)
- Email provider account (Resend recommended)

---

## Environment Variables

Create `.env.local` at the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rationale"

# Better Auth
BETTER_AUTH_SECRET="generate-with: openssl rand -base64 32"
BETTER_AUTH_URL="http://localhost:3000"

# Email (for password reset)
RESEND_API_KEY="re_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe price IDs
STRIPE_PRO_PRICE_ID="price_..."

# AI (for draft generation)
OPENAI_API_KEY="sk-..."    # or Anthropic key depending on provider chosen
```

---

## Initial Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

---

## Stripe Local Webhook Testing

```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret printed and set as STRIPE_WEBHOOK_SECRET
```

---

## Validation Checklist

Once the dev server is running, verify these flows manually:

### Auth
- [ ] Visit `http://localhost:3000` — landing page loads
- [ ] Click signup — create an account with email/password
- [ ] Create a workspace during onboarding
- [ ] Log out and log back in
- [ ] Request a password reset email

### Decision Flow
- [ ] Click "New Decision" — form loads
- [ ] Fill in title, rationale, owner, review date and save
- [ ] Decision appears in list with correct status badge
- [ ] Open decision detail — all fields visible, rationale prominent
- [ ] Edit the decision — changes persist

### Search & Review
- [ ] Search for a keyword in the decision title — result appears
- [ ] Set a review date in the past — decision appears in Review Inbox under "Overdue"
- [ ] Click "Archive" in the inbox — decision moves to Archived status

### Billing
- [ ] Visit Settings → Billing — current plan shows "Free"
- [ ] Click Upgrade — Stripe Checkout loads in test mode
- [ ] Complete checkout with test card `4242 4242 4242 4242`
- [ ] Return to app — subscription status shows as Pro/Active

### AI Draft
- [ ] Click "New Decision" → "Draft from notes"
- [ ] Paste sample meeting notes
- [ ] AI draft appears with title, summary, rationale pre-filled
- [ ] Edit a field — edit persists in draft
- [ ] Save — decision saved with the edited content

---

## Useful Commands

```bash
# Open Prisma Studio (DB browser)
npx prisma studio

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build
```
