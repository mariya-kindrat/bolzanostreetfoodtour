import type { AvailabilityInput, AvailabilityResult } from "./types";

function isSameDate(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

export function resolveAvailability(input: AvailabilityInput): AvailabilityResult {
  const { seasonalAvailabilities, dateOverrides, globalBlackouts, activeHolds, confirmedParticipantCount } = input;
  const now = input.now ?? new Date();
  // Seasonal windows are compared as raw instants, so the input date is normalized to
  // UTC midnight here (not at each caller) to keep that check consistent with the
  // day-granularity blackout/override/hold matching below.
  const date = new Date(input.date.toISOString().slice(0, 10) + "T00:00:00.000Z");

  if (globalBlackouts.some((b) => isSameDate(b.date, date))) {
    return { isAvailable: false, capacity: 0, remaining: 0, reason: "blackout" };
  }

  const override = dateOverrides.find((o) => isSameDate(o.date, date));
  if (override?.isBlocked) {
    return { isAvailable: false, capacity: 0, remaining: 0, reason: "blocked" };
  }

  let capacity: number;
  if (override?.capacityOverride != null) {
    capacity = override.capacityOverride;
  } else {
    const season = seasonalAvailabilities.find((s) => date >= s.startDate && date <= s.endDate);
    if (!season) {
      return { isAvailable: false, capacity: 0, remaining: 0, reason: "out_of_season" };
    }
    capacity = season.capacity;
  }

  const heldCount = activeHolds
    .filter((h) => isSameDate(h.date, date) && h.expiresAt > now)
    .reduce((sum, h) => sum + h.participantsCount, 0);

  const remaining = Math.max(capacity - confirmedParticipantCount - heldCount, 0);

  return {
    isAvailable: remaining > 0,
    capacity,
    remaining,
    reason: remaining > 0 ? undefined : "sold_out",
  };
}
