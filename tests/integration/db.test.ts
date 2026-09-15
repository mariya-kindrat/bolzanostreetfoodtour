import { describe, expect, it, afterAll } from "vitest";
import { db } from "@/lib/db";

describe("Prisma client", () => {
  it("creates and reads a HealthCheck row", async () => {
    const created = await db.healthCheck.create({ data: {} });
    const found = await db.healthCheck.findUnique({ where: { id: created.id } });
    expect(found?.id).toBe(created.id);
  });

  afterAll(async () => {
    await db.$disconnect();
  });
});
