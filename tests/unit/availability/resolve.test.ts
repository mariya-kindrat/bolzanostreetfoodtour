import { describe, expect, it } from "vitest";
import { resolveAvailability } from "@/lib/availability/resolve";
import type { DateOverride, GlobalBlackout, BookingHold, SeasonalAvailability } from "@/lib/generated/prisma/client";

const season: SeasonalAvailability = {
  id: "s1", tourId: "t1", startDate: new Date("2026-04-01"), endDate: new Date("2026-10-31"),
  capacity: 10, createdAt: new Date(),
};

function baseInput(overrides: Partial<Parameters<typeof resolveAvailability>[0]> = {}) {
  return {
    date: new Date("2026-07-15"),
    seasonalAvailabilities: [season],
    dateOverrides: [] as DateOverride[],
    globalBlackouts: [] as GlobalBlackout[],
    activeHolds: [] as BookingHold[],
    confirmedParticipantCount: 0,
    ...overrides,
  };
}

describe("resolveAvailability", () => {
  it("is available for a date inside the seasonal window", () => {
    const result = resolveAvailability(baseInput());
    expect(result.isAvailable).toBe(true);
    expect(result.remaining).toBe(10);
  });

  it("is unavailable for a date outside every seasonal window", () => {
    const result = resolveAvailability(baseInput({ date: new Date("2026-12-01") }));
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toBe("out_of_season");
  });

  it("respects a blocking date override", () => {
    const override: DateOverride = {
      id: "o1", tourId: "t1", date: new Date("2026-07-15"), isBlocked: true,
      capacityOverride: null, createdAt: new Date(),
    };
    const result = resolveAvailability(baseInput({ dateOverrides: [override] }));
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toBe("blocked");
  });

  it("respects a capacity override", () => {
    const override: DateOverride = {
      id: "o2", tourId: "t1", date: new Date("2026-07-15"), isBlocked: false,
      capacityOverride: 3, createdAt: new Date(),
    };
    const result = resolveAvailability(baseInput({ dateOverrides: [override], confirmedParticipantCount: 3 }));
    expect(result.remaining).toBe(0);
    expect(result.isAvailable).toBe(false);
  });

  it("is unavailable on a globally blacked-out date", () => {
    const blackout: GlobalBlackout = { id: "b1", date: new Date("2026-07-15"), reason: null, createdAt: new Date() };
    const result = resolveAvailability(baseInput({ globalBlackouts: [blackout] }));
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toBe("blackout");
  });

  it("has zero remaining when confirmed bookings exactly fill capacity", () => {
    const result = resolveAvailability(baseInput({ confirmedParticipantCount: 10 }));
    expect(result.remaining).toBe(0);
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toBe("sold_out");
  });

  it("subtracts active holds from remaining capacity", () => {
    const hold: BookingHold = {
      id: "h1", tourId: "t1", date: new Date("2026-07-15"), participantsCount: 4,
      expiresAt: new Date("2026-07-14T23:00:00Z"), bookingId: null, createdAt: new Date(),
    };
    const now = new Date("2026-07-14T12:00:00Z");
    const result = resolveAvailability(baseInput({ activeHolds: [hold], now }));
    expect(result.remaining).toBe(6);
  });

  it("ignores an expired hold", () => {
    const hold: BookingHold = {
      id: "h2", tourId: "t1", date: new Date("2026-07-15"), participantsCount: 4,
      expiresAt: new Date("2026-07-14T10:00:00Z"), bookingId: null, createdAt: new Date(),
    };
    const now = new Date("2026-07-14T12:00:00Z");
    const result = resolveAvailability(baseInput({ activeHolds: [hold], now }));
    expect(result.remaining).toBe(10);
  });
});
