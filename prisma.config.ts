import { defineConfig } from "prisma/config";

// Prisma 7 no longer supports `url = env(...)` inline in schema.prisma;
// the datasource URL is configured here instead.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
