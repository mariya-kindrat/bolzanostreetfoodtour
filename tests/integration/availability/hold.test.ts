import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  createBookingHold,
  CapacityExceededError,
  InvalidParticipantsCountError,
} from "@/lib/availability/hold";
async function makeTourWithCapacity(capacity: number) {
  const tour = await db.tour.create({
    data: {
      slug: `hold-test-${Date.now()}`,
      title: "Hold Test Tour",
      category: { connect: { slug: "cooking-classes" } },
      summary: "s",
      description: "d",
    },
  });
  await db.seasonalAvailability.create({
    data: { tourId: tour.id, startDate: new Date("2026-01-01"), endDate: new Date("2026-12-31"), capacity },
  });
  return tour;
}

describe("createBookingHold", () => {
  it("creates a hold when capacity is available", async () => {
    const tour = await makeTourWithCapacity(10);
    try {
      const hold = await createBookingHold({ tourId: tour.id, date: new Date("2026-07-01"), participantsCount: 4 });
      expect(hold.participantsCount).toBe(4);
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });

  it("rejects a hold that would exceed capacity", async () => {
    const tour = await makeTourWithCapacity(2);
    try {
      await expect(
        createBookingHold({ tourId: tour.id, date: new Date("2026-07-02"), participantsCount: 3 }),
      ).rejects.toThrow(CapacityExceededError);
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });

  it("rejects a hold for fewer than one participant", async () => {
    const tour = await makeTourWithCapacity(10);
    try {
      await expect(
        createBookingHold({ tourId: tour.id, date: new Date("2026-07-04"), participantsCount: 0 }),
      ).rejects.toThrow(InvalidParticipantsCountError);
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });

  it("rejects a hold on a blocked date and reports why", async () => {
    const tour = await makeTourWithCapacity(10);
    const date = new Date("2026-07-05");
    try {
      await db.dateOverride.create({ data: { tourId: tour.id, date, isBlocked: true } });
      await expect(
        createBookingHold({ tourId: tour.id, date, participantsCount: 2 }),
      ).rejects.toMatchObject({ name: "CapacityExceededError", reason: "blocked" });
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });

  it("allows exactly one of two simultaneous holds for the last spot to succeed", async () => {
    const tour = await makeTourWithCapacity(5);
    try {
      const date = new Date("2026-07-03");
      const results = await Promise.allSettled([
        createBookingHold({ tourId: tour.id, date, participantsCount: 3 }),
        createBookingHold({ tourId: tour.id, date, participantsCount: 3 }),
      ]);

      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");
      expect(fulfilled).toHaveLength(1);
      expect(rejected).toHaveLength(1);
      expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(CapacityExceededError);

      const holds = await db.bookingHold.findMany({ where: { tourId: tour.id, date } });
      expect(holds).toHaveLength(1);
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });
});
