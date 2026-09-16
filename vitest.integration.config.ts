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
    },
  };
});
