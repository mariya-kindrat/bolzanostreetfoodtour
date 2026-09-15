# Phase 0 — Project Setup & Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An empty but fully deployable, monitored Next.js skeleton app — pushing to
`dev` deploys a blank app to the dev environment, `/admin` requires Clerk login, a thrown
error shows in Sentry, a log line shows in Axiom.

**Architecture:** Next.js App Router + TypeScript, full-stack (no separate backend),
Prisma against Neon Postgres, deployed on Vercel with `main`→prod / `dev`→dev branch
mapping and PR previews. Local dev runs in Docker against the Neon dev branch (no local
Postgres container).

**Tech Stack:** Next.js (App Router) + TypeScript (strict), npm, Prisma, Neon Postgres,
Vercel, Clerk, Sentry, Pino → Axiom, GitHub Actions, Dependabot, Vitest, Playwright.

**Spec:** `CLAUDE.md` (tech stack, folder structure, coding standards, env var list),
`PLAN.md` (Phase 0 section), `JIRA_TICKETS.md` (EPIC-0, tickets 0.1–0.12 /
Jira BSFT-20–BSFT-31).

## Global Constraints

- TypeScript `strict` mode; no `any` without a justifying comment.
- No overengineering — three similar lines beat a premature helper; build only what this
  phase's deliverable needs.
- Short, focused files; one responsibility per file.
- Sparse comments — only non-obvious *why*, never *what*.
- No emojis anywhere (code, commit messages, UI copy, docs).
- Folder structure exactly as defined in `CLAUDE.md`'s Architecture section.
- **Real secret values (API keys, DSNs, tokens, connection strings) are supplied by the
  user, never invented, guessed, or reused by the agent.** Any task step that needs one
  is marked `HUMAN ACTION REQUIRED` and the agent stops there until the user provides it.
- Two environments only: **dev** and **prod** — no other environment names anywhere.
- Every task ends with a working, independently verifiable deliverable and a commit.

---

## File Structure

```text
app/
  (marketing)/page.tsx        # placeholder home page (Phase 2 builds real content)
  admin/
    layout.tsx                 # Clerk-gated layout for the whole /admin tree
    page.tsx                   # placeholder admin landing page
  api/
    sentry-test/route.ts       # throws a test error, removed before Phase 2 ships real routes
  layout.tsx
  globals.css
components/
  ui/                          # empty at this phase, populated in Phase 2
  marketing/
  booking/
  admin/
lib/
  availability/                # empty at this phase, populated in Phase 1
  pricing/
  stripe/
  email/
  ai-agent/
  logging/
    logger.ts                  # Pino logger singleton, ships to Axiom
  db.ts                        # Prisma client singleton
prisma/
  schema.prisma                # placeholder model only, real models in Phase 1
  migrations/
types/
tests/
  unit/
    smoke.test.ts               # proves Vitest runs
  integration/
  e2e/
    smoke.spec.ts               # proves Playwright runs, incl. one mobile-viewport variant
docker/
  Dockerfile.dev
docs/
  architecture.md
  infrastructure.md
.github/
  workflows/ci.yml
  dependabot.yml
middleware.ts                   # Clerk middleware, gates /admin
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts
next.config.ts
.env.example
.env.local                      # gitignored, not committed
.eslintrc.json  (or eslint.config.mjs, whichever create-next-app emits)
.gitignore
package.json
README.md
vercel.json
```

## Interfaces established in this phase (consumed by later phases)

- `lib/db.ts` exports `db: PrismaClient` (singleton, reused by every later query).
- `lib/logging/logger.ts` exports `logger: pino.Logger` with `.info()`/`.warn()`/`.error()`,
  each call accepting a first arg object for structured context (e.g. `{ requestId, tourId }`).
- `prisma/schema.prisma` has a `datasource db` block reading `DATABASE_URL` from env —
  Phase 1 adds real models to this same file.
- `.env.example` is the single source of truth for every env var name Phase 1 onward relies on.

---

### Task 1: Next.js + TypeScript scaffold, folder structure, ESLint/Prettier
**Jira:** BSFT-20 (0.1)

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`,
  `app/(marketing)/page.tsx`, `.eslintrc.json` (or equivalent from create-next-app),
  `.prettierrc`, `.gitignore`
- Create (empty, `.gitkeep`'d) dirs: `components/ui`, `components/marketing`,
  `components/booking`, `components/admin`, `lib/availability`, `lib/pricing`,
  `lib/stripe`, `lib/email`, `lib/ai-agent`, `lib/logging`, `types`, `tests/unit`,
  `tests/integration`, `tests/e2e`

**Interfaces:**
- Produces: the Next.js App Router project other tasks scaffold into; `npm run lint`,
  `npm run build`, `npm run dev` scripts in `package.json`.

- [ ] **Step 1: Scaffold the Next.js project**

Run in the repo root (already git-initialized):

```bash
npx create-next-app@latest . --typescript --eslint --app --no-src-dir --no-tailwind --import-alias "@/*" --use-npm
```

Answer "Yes" if prompted to scaffold into a non-empty directory (this repo already has
`CLAUDE.md`, `PLAN.md`, `JIRA_TICKETS.md`, `files/`, `docs/` — those are not touched).

- [ ] **Step 2: Add Prettier**

```bash
npm install --save-dev prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100
}
```

Update `.eslintrc.json` (or `eslint.config.mjs` if create-next-app emitted the flat
config) to extend `prettier` last so Prettier owns formatting, ESLint owns correctness.

- [ ] **Step 3: Create the CLAUDE.md folder structure**

```bash
mkdir -p components/ui components/marketing components/booking components/admin \
  lib/availability lib/pricing lib/stripe lib/email lib/ai-agent lib/logging \
  types tests/unit tests/integration tests/e2e
touch components/ui/.gitkeep components/marketing/.gitkeep components/booking/.gitkeep \
  components/admin/.gitkeep lib/availability/.gitkeep lib/pricing/.gitkeep \
  lib/stripe/.gitkeep lib/email/.gitkeep lib/ai-agent/.gitkeep types/.gitkeep \
  tests/integration/.gitkeep
```

- [ ] **Step 4: Move the placeholder home page into the `(marketing)` route group**

```bash
mkdir -p "app/(marketing)"
git mv app/page.tsx "app/(marketing)/page.tsx"
```

Edit `"app/(marketing)/page.tsx"` to a minimal placeholder:

```tsx
export default function HomePage() {
  return <main>Bolzano Street Food Tour — under construction</main>;
}
```

- [ ] **Step 5: Verify lint, type-check, and build all pass clean**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all three exit 0 with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js + TypeScript project with CLAUDE.md folder structure"
```

---

### Task 2: Docker local development setup
**Jira:** BSFT-21 (0.2)

**Files:**
- Create: `docker/Dockerfile.dev`, `.dockerignore`

**Interfaces:**
- Consumes: `package.json` scripts from Task 1.
- Produces: `docker build -f docker/Dockerfile.dev` image other developers use for local dev.

- [ ] **Step 1: Write `docker/Dockerfile.dev`**

```dockerfile
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

- [ ] **Step 2: Write `.dockerignore`**

```text
node_modules
.next
.git
.env.local
```

- [ ] **Step 3: Build the image and verify it runs**

```bash
docker build -f docker/Dockerfile.dev -t bsft-dev .
docker run --rm -p 3000:3000 --env-file .env.local bsft-dev &
sleep 5
curl -sf http://localhost:3000 > /dev/null && echo "OK: dev server responded"
kill %1
```

Expected: `OK: dev server responded`. (This step depends on `.env.local` existing — if
Task 4 hasn't run yet, use `docker run --rm -p 3000:3000 bsft-dev` without `--env-file`
for this smoke check only; Prisma-backed routes will fail until `DATABASE_URL` is set,
which is expected at this stage since no DB-backed routes exist yet.)

- [ ] **Step 4: Commit**

```bash
git add docker/Dockerfile.dev .dockerignore
git commit -m "Add Docker local development setup"
```

---

### Task 3: Provision Neon databases and initialize Prisma
**Jira:** BSFT-22 (0.3)

**Files:**
- Create: `prisma/schema.prisma`, `lib/db.ts`

**Interfaces:**
- Produces: `db` (Prisma client singleton) from `lib/db.ts`, imported by every later
  data-access module. `prisma/schema.prisma`'s `datasource db` block is extended (not
  replaced) by Phase 1's real models.

- [ ] **Step 1 — HUMAN ACTION REQUIRED: create the Neon databases**

Stop here and ask the user to:
1. Create two Neon projects/branches: `bsft-dev` and `bsft-prod` (or one project with a
   `dev` and a `main`/`prod` branch — either is fine as long as they are genuinely
   separate databases).
2. Paste back the **dev** database's connection string (the prod one is only needed later,
   for Vercel's Production environment variables in Task 7).

Do not proceed past this step with a guessed or placeholder connection string.

- [ ] **Step 2: Install Prisma and initialize**

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and a starter `.env`. Delete the auto-generated
`.env` (env files are handled by Task 4) and confirm `prisma/schema.prisma` reads:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Step 3: Add a placeholder model so `migrate dev` has something to apply**

Append to `prisma/schema.prisma` (Phase 1 replaces this with the real domain models):

```prisma
model HealthCheck {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
}
```

- [ ] **Step 4: Create the Prisma client singleton**

`lib/db.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 5: Run the migration against the Neon dev database**

With `DATABASE_URL` set in the shell (or a temporary `.env` — Task 4 formalizes this):

```bash
npx prisma migrate dev --name init
```

Expected: migration applies cleanly, `prisma/migrations/<timestamp>_init/migration.sql`
is created.

- [ ] **Step 6: Verify the client round-trips a row**

`tests/integration/db.test.ts`:

```typescript
import { describe, expect, it, afterAll } from "vitest";
import { db } from "@/lib/db";

describe("Prisma client", () => {
  it("creates and reads a HealthCheck row", async () => {
    const created = await db.healthCheck.create({ data: {} });
    const found = await db.healthCheck.findUnique({ where: { id: created.id } });
    expect(found?.id).toBe(created.id);
  });

  afterAll(async () => {
    await db.$disconnect();
  });
});
```

Run: `npx vitest run tests/integration/db.test.ts`
Expected: PASS (requires `DATABASE_URL` pointed at the Neon dev database).

- [ ] **Step 7: Commit**

```bash
git add prisma lib/db.ts tests/integration/db.test.ts
git commit -m "Initialize Prisma against Neon dev database"
```

---

### Task 4: Environment configuration files
**Jira:** BSFT-23 (0.4)

**Files:**
- Create: `.env.example`
- Create (gitignored): `.env.local`
- Modify: `.gitignore`

**Interfaces:**
- Produces: the canonical env var name list every later task's code reads via `process.env`.

- [ ] **Step 1: Write `.env.example`**

```text
# Postgres connection string (Neon). Get from: Neon dashboard > project > Connection Details
DATABASE_URL=

# Stripe API keys and webhook signing secret. Get from: Stripe dashboard > Developers > API keys / Webhooks
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Clerk auth keys. Get from: Clerk dashboard > your application > API Keys
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Resend transactional email API key. Get from: Resend dashboard > API Keys
RESEND_API_KEY=

# OpenRouter API key for the AI agent. Get from: openrouter.ai > Keys
OPENROUTER_API_KEY=

# Sentry error monitoring DSN. Get from: Sentry dashboard > project > Settings > Client Keys (DSN)
SENTRY_DSN=

# Axiom structured logging. Get from: Axiom dashboard > Settings > API Tokens (token), and your dataset name
AXIOM_TOKEN=
AXIOM_DATASET=

# Public site URL, used for absolute links (emails, sitemap, redirects)
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 2: Ensure `.env.local` is gitignored**

Confirm `.gitignore` (created by `create-next-app`) already contains `.env*.local`; if
not, add:

```text
.env.local
```

- [ ] **Step 3 — HUMAN ACTION REQUIRED: populate `.env.local`**

Stop here and ask the user to copy `.env.example` to `.env.local` and fill in real
**test-mode**/dev values (Neon dev connection string from Task 3, Stripe test keys,
Clerk dev keys, Resend key, OpenRouter key, Sentry DSN, Axiom token/dataset,
`NEXT_PUBLIC_SITE_URL=http://localhost:3000`). The agent never writes real values into
this file itself.

- [ ] **Step 4: Verify `.env.local` is not tracked by git**

```bash
git check-ignore .env.local && echo "OK: ignored"
```

Expected: `OK: ignored`.

- [ ] **Step 5: Commit**

```bash
git add .env.example .gitignore
git commit -m "Add environment variable template and gitignore local env file"
```

---

### Task 5: GitHub repo, branching, and branch protection
**Jira:** BSFT-24 (0.5)

**Files:** none (repo/branch configuration only)

**Interfaces:** none — this task configures where later CI/Vercel tasks attach.

- [ ] **Step 1: Push the initial commits to the existing GitHub remote**

The remote `origin` (`https://github.com/mariya-kindrat/bolzanostreetfoodtour.git`) is
already configured. Push `main`:

```bash
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Create the `dev` branch**

```bash
git checkout -b dev
git push -u origin dev
git checkout main
```

- [ ] **Step 3 — HUMAN ACTION REQUIRED if `gh` isn't authenticated: verify GitHub CLI auth**

```bash
gh auth status
```

If not authenticated, stop and ask the user to run `gh auth login` themselves (an agent
should not handle GitHub credential flows).

- [ ] **Step 4: Configure branch protection on `main` and `dev`**

Requires GitHub Actions CI (Task 6) to exist first so the required check name is real —
do this step after Task 6's workflow file is merged. Then:

```bash
gh api repos/mariya-kindrat/bolzanostreetfoodtour/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["lint","type-check","test","e2e"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null

gh api repos/mariya-kindrat/bolzanostreetfoodtour/branches/dev/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["lint","type-check","test","e2e"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

- [ ] **Step 5: Verify protection is active**

```bash
gh api repos/mariya-kindrat/bolzanostreetfoodtour/branches/main/protection --jq '.required_status_checks.contexts'
```

Expected: `["lint","type-check","test","e2e"]`.

No commit for this task (repository configuration only, not a file change).

---

### Task 6: GitHub Actions CI pipeline
**Jira:** BSFT-25 (0.6)

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `package.json` (add `test`, `test:e2e` scripts, `vitest`/`@playwright/test` deps)

**Interfaces:**
- Produces: CI job names `lint`, `type-check`, `test`, `test:e2e` — Task 5's branch
  protection rule references these exact names.

- [ ] **Step 1: Install Vitest and Playwright**

```bash
npm install --save-dev vitest @vitejs/plugin-react vite-tsconfig-paths @playwright/test
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Add a trivial failing smoke test first**

`tests/unit/smoke.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(3);
  });
});
```

Run: `npx vitest run tests/unit/smoke.test.ts`
Expected: FAIL (`1 + 1` is not `3`).

- [ ] **Step 3: Fix the assertion**

```typescript
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npx vitest run tests/unit/smoke.test.ts`
Expected: PASS.

- [ ] **Step 4: Add a Playwright smoke spec with a mobile-viewport variant**

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
```

`tests/e2e/smoke.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bolzano Street Food Tour")).toBeVisible();
});
```

Run: `npx playwright test`
Expected: PASS on both `desktop` and `mobile` projects.

- [ ] **Step 5: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 6: Write the CI workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 7: Push on a branch and open a PR to verify the workflow triggers**

```bash
git checkout -b ci/github-actions
git add .github/workflows/ci.yml tests/unit/smoke.test.ts tests/e2e/smoke.spec.ts \
  playwright.config.ts package.json package-lock.json
git commit -m "Add GitHub Actions CI: lint, type-check, unit tests, e2e tests"
git push -u origin ci/github-actions
gh pr create --base dev --title "Add CI pipeline" --body "Adds lint/type-check/test/e2e as GitHub Actions jobs."
```

Expected: all four jobs (`lint`, `type-check`, `test`, `e2e`) show green on the PR.
Merge the PR once green, then return to Task 5 Step 4 to apply branch protection.

---

### Task 7: Vercel project and environment configuration
**Jira:** BSFT-26 (0.7)

**Files:**
- Create: `vercel.json` (only if non-default settings are needed — start without one and
  add only if the default Next.js detection needs overriding)

**Interfaces:** none — deployment configuration only.

- [ ] **Step 1 — HUMAN ACTION REQUIRED: Vercel account and project link**

Stop here and ask the user to either:
(a) run `npx vercel login` and `npx vercel link` themselves interactively (Vercel login
    is a browser OAuth flow an agent cannot complete), or
(b) link the GitHub repo to Vercel via the Vercel dashboard (Add New Project → import
    `mariya-kindrat/bolzanostreetfoodtour`).

- [ ] **Step 2: Configure branch → environment mapping**

In the Vercel dashboard project settings → Git: confirm `main` deploys to Production and
`dev` deploys to a named environment (Vercel's "Preview" environment scoped to the `dev`
branch, or a custom environment if the user's Vercel plan supports it). Confirm "Preview
Deployments" is enabled for all other branches/PRs (this is Vercel's default).

- [ ] **Step 3 — HUMAN ACTION REQUIRED: set environment variables in Vercel**

Ask the user to enter, in the Vercel dashboard (Project → Settings → Environment
Variables), every variable from `.env.example`:
- Under **Development** (mapped to the `dev` branch): dev/test values matching `.env.local`.
- Under **Production** (mapped to `main`): the Neon **prod** connection string and
  **live** Stripe/Clerk keys — the agent never enters these.

- [ ] **Step 4: Verify a deploy succeeds**

```bash
git checkout dev
git push origin dev
```

Expected: a new deployment appears in the Vercel dashboard for the `dev` branch and
builds successfully. Confirm the deployed URL loads the placeholder home page.

No commit needed unless `vercel.json` was added — if it was:

```bash
git add vercel.json
git commit -m "Add Vercel configuration"
```

---

### Task 8: Clerk authentication for admin area
**Jira:** BSFT-27 (0.8)

**Files:**
- Create: `middleware.ts`, `app/admin/layout.tsx`, `app/admin/page.tsx`

**Interfaces:**
- Produces: every route under `app/admin/**` is auth-gated by the `middleware.ts`
  matcher — later phases add pages under `app/admin/` without adding auth logic per-page.

- [ ] **Step 1 — HUMAN ACTION REQUIRED: create Clerk applications**

Stop here and ask the user to create two Clerk applications (or one application with dev
and production instances) and paste back the **dev** instance's publishable + secret
keys for `.env.local`. Production keys go directly into Vercel (Task 7), not into any
file the agent writes.

- [ ] **Step 2: Install Clerk**

```bash
npm install @clerk/nextjs
```

- [ ] **Step 3: Wrap the app in `ClerkProvider`**

Modify `app/layout.tsx`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 4: Add Clerk middleware gating `/admin`**

`middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

- [ ] **Step 5: Add the placeholder admin layout and page**

`app/admin/layout.tsx`:

```tsx
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
```

`app/admin/page.tsx`:

```tsx
export default function AdminHomePage() {
  return <main>Admin — signed in</main>;
}
```

- [ ] **Step 6: Write an e2e test asserting the redirect**

`tests/e2e/admin-auth.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test("visiting /admin while logged out redirects to Clerk sign-in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/sign-in/);
});
```

Run: `npx playwright test tests/e2e/admin-auth.spec.ts`
Expected: PASS (requires `.env.local`'s Clerk dev keys to be set from Step 1).

- [ ] **Step 7: Commit**

```bash
git add middleware.ts app/admin app/layout.tsx tests/e2e/admin-auth.spec.ts package.json package-lock.json
git commit -m "Gate /admin behind Clerk authentication"
```

---

### Task 9: Sentry error monitoring
**Jira:** BSFT-28 (0.9)

**Files:**
- Create: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`,
  `app/api/sentry-test/route.ts`
- Modify: `next.config.ts` (wrap with `withSentryConfig`)

**Interfaces:** none consumed by later phases directly — Sentry captures unhandled
exceptions app-wide once wired in.

- [ ] **Step 1 — HUMAN ACTION REQUIRED: create Sentry project**

Stop here and ask the user to create a Sentry project and paste back the DSN for
`.env.local` (`SENTRY_DSN`). Production's DSN (same project, or a separate one if the
user prefers environment-level separation) goes into Vercel's Production env vars.

- [ ] **Step 2: Install and run the Sentry wizard**

```bash
npx @sentry/wizard@latest -i nextjs
```

Accept the wizard's generated `sentry.client.config.ts`, `sentry.server.config.ts`,
`sentry.edge.config.ts`, and its edit to `next.config.ts`. Point each config's `dsn` at
`process.env.SENTRY_DSN` (the wizard defaults to a hardcoded literal — replace it):

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

(apply the same `dsn`/`environment` pattern to the server and edge config files).

- [ ] **Step 3: Add a deliberate test-error route**

`app/api/sentry-test/route.ts`:

```typescript
export async function GET() {
  throw new Error("Sentry test error from /api/sentry-test");
}
```

- [ ] **Step 4: Verify the error reaches Sentry**

```bash
npm run build && npm run start &
sleep 3
curl -s http://localhost:3000/api/sentry-test > /dev/null
kill %1
```

Then check the Sentry dashboard for the "Sentry test error" issue. This route is
intentionally temporary — leave a note to remove it once Phase 6's hardening pass
confirms Sentry is stable, or remove it now if verification already succeeded.

- [ ] **Step 5: Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts \
  next.config.ts app/api/sentry-test package.json package-lock.json
git commit -m "Wire Sentry error monitoring into client, server, and edge runtimes"
```

---

### Task 10: Structured logging via Pino + Axiom
**Jira:** BSFT-29 (0.10)

**Files:**
- Create: `lib/logging/logger.ts`
- Modify: `app/api/sentry-test/route.ts` (add a log line so Step 4 has something to search for)

**Interfaces:**
- Produces: `logger` from `lib/logging/logger.ts`, imported by every route handler /
  server action from Phase 1 onward for structured JSON logs.

- [ ] **Step 1 — HUMAN ACTION REQUIRED: create Axiom dataset**

Stop here and ask the user to create an Axiom dataset (e.g. `bsft`) and an API token,
then paste back `AXIOM_TOKEN` and `AXIOM_DATASET` for `.env.local`.

- [ ] **Step 2: Install Pino and the Axiom transport**

```bash
npm install pino @axiomhq/pino
```

- [ ] **Step 3: Create the logger singleton**

`lib/logging/logger.ts`:

```typescript
import pino from "pino";

const transport =
  process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET
    ? pino.transport({
        target: "@axiomhq/pino",
        options: {
          dataset: process.env.AXIOM_DATASET,
          token: process.env.AXIOM_TOKEN,
        },
      })
    : undefined;

export const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    base: { environment: process.env.NODE_ENV },
  },
  transport,
);
```

- [ ] **Step 4: Emit a log line from the test route and verify it in Axiom**

Modify `app/api/sentry-test/route.ts`:

```typescript
import { logger } from "@/lib/logging/logger";

export async function GET() {
  logger.info({ route: "/api/sentry-test" }, "handling sentry test request");
  throw new Error("Sentry test error from /api/sentry-test");
}
```

```bash
npm run build && npm run start &
sleep 3
curl -s http://localhost:3000/api/sentry-test > /dev/null
kill %1
```

Check the Axiom dataset for the `"handling sentry test request"` log line with
`route: "/api/sentry-test"` in its structured fields.

- [ ] **Step 5: Commit**

```bash
git add lib/logging/logger.ts app/api/sentry-test/route.ts package.json package-lock.json
git commit -m "Add Pino structured logging shipping to Axiom"
```

---

### Task 11: Dependabot configuration
**Jira:** BSFT-30 (0.11)

**Files:**
- Create: `.github/dependabot.yml`

**Interfaces:** none.

- [ ] **Step 1: Write the Dependabot config**

`.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        dependency-type: development
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
```

- [ ] **Step 2: Verify it's picked up**

```bash
git add .github/dependabot.yml
git commit -m "Configure Dependabot for npm and GitHub Actions updates"
git push
```

Check the repo's Insights → Dependency graph → Dependabot tab shows the config as active
(may take a few minutes, or until the next scheduled run — this is a GitHub-side
async check, not something the agent can force synchronously).

---

### Task 12: Initial README and docs skeleton
**Jira:** BSFT-31 (0.12)

**Files:**
- Create: `README.md`, `docs/architecture.md`, `docs/infrastructure.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Write `README.md`**

```markdown
# Bolzano Street Food Tour

Full rebuild of bolzanostreetfoodtour.com: custom booking/availability/payments, a
custom admin panel, and an AI agent — replacing the previous Wix site entirely.

## Prerequisites

- Node.js 22+
- Docker (for local dev)
- A Neon Postgres connection string (dev branch)
- Test-mode API keys for Stripe, Clerk, Resend, OpenRouter, Sentry, Axiom (see
  `.env.example` for the full list and where each comes from)

## Local setup

1. Copy `.env.example` to `.env.local` and fill in dev/test values.
2. Run with Docker:

   \`\`\`bash
   docker build -f docker/Dockerfile.dev -t bsft-dev .
   docker run --rm -p 3000:3000 --env-file .env.local bsft-dev
   \`\`\`

   Or without Docker:

   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

3. Apply database migrations: `npx prisma migrate dev`

## Running tests

- Unit/integration: `npm run test`
- End-to-end: `npm run test:e2e`
- Lint: `npm run lint`
- Type-check: `npm run type-check`

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — system architecture, data flow, key
  design decisions
- [`docs/infrastructure.md`](docs/infrastructure.md) — environments, hosting, CI/CD,
  monitoring, deploy/rollback
- [`docs/routes-and-components.md`](docs/routes-and-components.md) — route map and
  component inventory (added in Phase 2)
- [`CLAUDE.md`](CLAUDE.md) — full project instructions and standards
- [`PLAN.md`](PLAN.md) — phase roadmap
```

- [ ] **Step 2: Write `docs/architecture.md`**

```markdown
# Architecture

## Stack

Next.js (App Router) + TypeScript, full-stack — route handlers and server actions, no
separate backend service. Prisma ORM against Neon Postgres. Deployed on Vercel.

## Data flow

Request → Next.js route handler / server action → `lib/*` domain module → `lib/db.ts`
(Prisma client singleton) → Neon Postgres.

## Environments

Two environments: **dev** and **prod**, each with its own Neon database, Stripe key
pair, and Clerk instance. `main` branch deploys to prod, `dev` branch deploys to dev.

## Logging and monitoring

Structured JSON logs via Pino (`lib/logging/logger.ts`), shipped to Axiom. Sentry
captures unhandled exceptions only — routine flow logging goes through Pino/Axiom.

## Design decisions (Phase 0)

- No local Postgres container — Docker dev points at the Neon dev branch over the
  network, since Neon's branching model makes a throwaway local DB redundant.
- Prisma client is a global singleton (`lib/db.ts`) to avoid exhausting Neon's
  connection limit across Next.js hot-reloads in dev.

*(Phase 1 adds the Prisma schema and the availability/pricing/hold algorithms to this
document.)*
```

- [ ] **Step 3: Write `docs/infrastructure.md`**

```markdown
# Infrastructure

## Environments

| Environment | Branch | Database | Stripe | Clerk |
|---|---|---|---|---|
| dev | `dev` | Neon dev branch | test keys | dev instance |
| prod | `main` | Neon prod branch | live keys | prod instance |

## Hosting

Vercel. `main` → Production deploy, `dev` → Development deploy, every PR → its own
preview deployment.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `type-check`, `test` (Vitest),
and `e2e` (Playwright) on every PR against `main` or `dev`. Both branches require all
four checks green plus one approving review before merge (branch protection).

**Release gate:** CI passing alone does not promote to prod. After CI is green on a PR
into `dev`, the change is manually reviewed on the dev environment (click through the
booking flow + any visual change) before a separate PR merges `dev` into `main`.

## Local development

Docker (`docker/Dockerfile.dev`), no local Postgres — connects over the network to the
Neon dev branch. See `README.md` for setup steps.

## Monitoring

- **Sentry** — unhandled exceptions, both environments.
- **Axiom** — structured JSON logs via Pino, both environments.
- **Uptime monitoring** — configured in Phase 7, once there's a real deployed URL worth
  monitoring continuously.

## Dependency updates

Dependabot (`.github/dependabot.yml`), weekly, grouped dev-dependency PRs, gated by the
same CI checks as any other PR.

## Deploy / rollback

Deploys are automatic on push (`dev`) or merge (`main`) via Vercel's Git integration. To
roll back, use Vercel's dashboard "Instant Rollback" to the previous deployment, or
revert the merge commit on `main` and let CI/CD redeploy.
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/architecture.md docs/infrastructure.md
git commit -m "Add README and initial architecture/infrastructure docs"
```

---

## Phase 0 Deliverable Verification

After all 12 tasks are committed and merged to `dev` via PR (CI green on each):

- [ ] Push to `dev` triggers a Vercel deployment that serves the placeholder home page
- [ ] Visiting `/admin` on that deployment redirects to Clerk sign-in when logged out
- [ ] `/api/sentry-test` throws and the error appears in the Sentry dashboard
- [ ] The log line from that same request appears in the Axiom dataset
- [ ] `main` and `dev` branch protection blocks a direct push and blocks merging with a
      failing check

Once verified, Phase 1's detailed plan (data model + domain logic) can be written.
