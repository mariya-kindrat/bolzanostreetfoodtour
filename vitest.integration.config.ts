import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadDotEnv } from "./vitest.shared";

// Run on demand (`npm run test:integration`), not part of `npm run test` /
// CI's "test" job: tests/integration hits the real Neon dev database via
// DATABASE_URL, which is not configured as a CI secret yet. See
// vitest.config.ts for the default (unit-only) config.
export default defineConfig(({ mode }) => {
  loadDotEnv(mode);

  return {
    plugins: [tsconfigPaths()],
    test: {
      environment: "node",
      include: ["tests/integration/**/*.test.ts"],
      // All integration tests share one live Neon dev database. Several
      // schema tests create a transient Tour row and clean it up in a
      // `finally` block; with vitest's default parallel file execution,
      // those transient rows are intermittently visible to this suite's
      // exact-count assertions (tests/integration/content/seed.test.ts).
      // Running files sequentially avoids the race.
      fileParallelism: false,
    },
  };
});
