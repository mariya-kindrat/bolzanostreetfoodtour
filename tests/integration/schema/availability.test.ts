import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";

describe("Availability schema", () => {
  it("creates a seasonal window, a per-tour override, and a global blackout independently", async () => {
    const tour = await db.tour.create({
      data: {
        slug: `test-tour-${Date.now()}`,
        title: "Test Tour",
        category: { connect: { slug: "wine-tours" } },
        summary: "s",
        description: "d",
      },
    });

    try {
      const season = await db.seasonalAvailability.create({
        data: { tourId: tour.id, startDate: new Date("2026-04-01"), endDate: new Date("2026-10-31"), capacity: 12 },
      });
      const override = await db.dateOverride.create({
        data: { tourId: tour.id, date: new Date("2026-05-01"), isBlocked: true },
      });
      const blackout = await db.globalBlackout.create({
        data: { date: new Date("2026-12-25"), reason: "Christmas" },
      });

      expect(season.capacity).toBe(12);
      expect(override.isBlocked).toBe(true);
      expect(blackout.reason).toBe("Christmas");

      await db.seasonalAvailability.delete({ where: { id: season.id } });
      await db.dateOverride.delete({ where: { id: override.id } });
      await db.globalBlackout.delete({ where: { id: blackout.id } });
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });
});
