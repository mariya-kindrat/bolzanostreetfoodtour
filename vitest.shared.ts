import { loadEnv } from "vite";

// Loads .env.local (and friends) into process.env so tests that need real
// config (e.g. lib/db.ts's DATABASE_URL) see it when run locally. No-op in
// CI, which has no .env.local. Shared by vitest.config.ts and
// vitest.integration.config.ts so the two configs can't drift out of sync.
export function loadDotEnv(mode: string): void {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
}
