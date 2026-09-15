import path from "node:path";
import { defineConfig } from "vitest/config";

// Minimal alias so tests/integration/db.test.ts can resolve "@/lib/db".
// Task 6 replaces this with the full Vitest setup.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
