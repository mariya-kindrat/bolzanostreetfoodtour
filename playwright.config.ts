import { defineConfig } from "@playwright/test";

/**
 * Minimal config to run Task 8's single e2e test today. Task 6 replaces this
 * with the full multi-project (desktop/mobile) Playwright setup.
 */
// A dedicated, non-default port avoids colliding with other dev servers that
// may already be running on :3000 on a shared machine.
const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `npm run build && PORT=${PORT} npm run start`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
