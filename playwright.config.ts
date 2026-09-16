import { defineConfig, devices } from "@playwright/test";

// A dedicated, non-default port avoids colliding with other dev servers that
// may already be running on :3000 on a shared machine.
const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  // admin-auth.spec.ts needs a real Clerk-hosted sign-in redirect. ci.yml
  // sets no Clerk env vars at all (not even placeholders), so /admin would
  // 500 (missing publishableKey) rather than redirect; this spec runs
  // locally only (against .env.local's real dev keys), not in CI. Adding a
  // CLERK_SECRET_KEY / NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY GitHub Actions
  // secret pair would let this run in CI too.
  testIgnore: process.env.CI ? ["tests/e2e/admin-auth.spec.ts"] : undefined,
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `npm run build && PORT=${PORT} npm run start`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Pixel 7 (Chromium-based) rather than an iOS device: only the Chromium
    // browser is installed in this environment/CI, and the goal here is
    // mobile-viewport coverage, not engine-specific (WebKit) coverage.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
