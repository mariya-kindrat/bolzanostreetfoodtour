import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load .env.local if it exists for local development (e.g., DATABASE_URL)
dotenv.config({ path: ".env.local" });

// Prisma 7 no longer supports `url = env(...)` inline in schema.prisma;
// the datasource URL is configured here instead.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
