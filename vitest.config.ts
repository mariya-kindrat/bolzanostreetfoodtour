import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadDotEnv } from "./vitest.shared";

export default defineConfig(({ mode }) => {
  loadDotEnv(mode);

  return {
    plugins: [react(), tsconfigPaths()],
    test: {
      environment: "node",
      // Only tests/unit runs by default (`npm run test`, and CI's "test"
      // job). tests/integration/db.test.ts hits the real Neon dev database
      // and needs a DATABASE_URL that isn't configured as a CI secret yet —
      // run it on demand with `npm run test:integration`. tests/e2e is
      // Playwright's own test suite (`npm run test:e2e`), never Vitest's.
      include: ["tests/unit/**/*.test.ts"],
      coverage: {
        provider: "v8",
        // Whole-directory globs so files added later are gated automatically.
        include: [
          "lib/availability/**",
          "lib/pricing/**",
          "lib/content/**",
          "lib/seo/**",
          "lib/hero/**",
          "lib/homepage/**",
          "lib/header/**",
          "lib/admin/**",
        ],
        // hold.ts: real Postgres + pg_advisory_xact_lock concurrency can't be
        // meaningfully mocked, verified via its integration test instead.
        // tours.ts/transfers.ts/blog.ts/categories.ts: thin Prisma query
        // wrappers with no branching logic of their own, verified via
        // tests/integration/content/seed.test.ts instead — same precedent
        // as hold.ts.
        exclude: [
          "lib/availability/hold.ts",
          "lib/content/tours.ts",
          "lib/content/transfers.ts",
          "lib/content/blog.ts",
          "lib/content/categories.ts",
        ],
        thresholds: {
          perFile: true,
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  };
});
