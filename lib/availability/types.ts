import type { DateOverride, GlobalBlackout, BookingHold, SeasonalAvailability } from "@/lib/generated/prisma/client";

export type AvailabilityReason = "blackout" | "blocked" | "out_of_season" | "sold_out";

export interface AvailabilityInput {
  date: Date;
  seasonalAvailabilities: SeasonalAvailability[];
  dateOverrides: DateOverride[];
  globalBlackouts: GlobalBlackout[];
  activeHolds: BookingHold[];
  confirmedParticipantCount: number;
  now?: Date;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  capacity: number;
  remaining: number;
  reason?: AvailabilityReason;
}
