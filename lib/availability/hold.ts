import { db } from "@/lib/db";
import { resolveAvailability } from "./resolve";

export class CapacityExceededError extends Error {
  constructor(public remaining: number, public requested: number) {
    super(`Requested ${requested} participants but only ${remaining} remain`);
    this.name = "CapacityExceededError";
  }
}

const DEFAULT_HOLD_MINUTES = 15;

// Deterministic 63-bit key from tourId+date for pg_advisory_xact_lock, so
// concurrent hold attempts for the same tour+date serialize on one lock
// while different tour+date pairs never block each other.
function lockKey(tourId: string, date: Date): bigint {
  const input = `${tourId}:${date.toISOString().slice(0, 10)}`;
  let hash = 0n;
  for (const char of input) {
    hash = (hash * 31n + BigInt(char.charCodeAt(0))) & 0x7fffffffffffffffn;
  }
  return hash;
}

export async function createBookingHold(params: {
  tourId: string;
  date: Date;
  participantsCount: number;
  holdMinutes?: number;
}) {
  const date = new Date(params.date.toISOString().slice(0, 10) + "T00:00:00.000Z");
  const holdMinutes = params.holdMinutes ?? DEFAULT_HOLD_MINUTES;

  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey(params.tourId, date)})`;

    const now = new Date();
    const [seasonalAvailabilities, dateOverrides, globalBlackouts, activeHolds, confirmedParticipants] =
      await Promise.all([
        tx.seasonalAvailability.findMany({ where: { tourId: params.tourId } }),
        tx.dateOverride.findMany({ where: { tourId: params.tourId } }),
        tx.globalBlackout.findMany(),
        tx.bookingHold.findMany({ where: { tourId: params.tourId, expiresAt: { gt: now } } }),
        tx.bookingParticipant.findMany({
          where: { booking: { tourId: params.tourId, date, status: { in: ["PENDING", "CONFIRMED"] } } },
        }),
      ]);

    const confirmedParticipantCount = confirmedParticipants.reduce((sum, p) => sum + p.count, 0);

    const availability = resolveAvailability({
      date,
      seasonalAvailabilities,
      dateOverrides,
      globalBlackouts,
      activeHolds,
      confirmedParticipantCount,
      now,
    });

    if (params.participantsCount > availability.remaining) {
      throw new CapacityExceededError(availability.remaining, params.participantsCount);
    }

    return tx.bookingHold.create({
      data: {
        tourId: params.tourId,
        date,
        participantsCount: params.participantsCount,
        expiresAt: new Date(now.getTime() + holdMinutes * 60_000),
      },
    });
  });
}
