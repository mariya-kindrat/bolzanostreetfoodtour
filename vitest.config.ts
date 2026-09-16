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
    },
  };
});
