import type { CouponType, PriceTier, PriceTierType } from "@/lib/generated/prisma/client";

export interface ParticipantGroup {
  tier: PriceTierType;
  count: number;
}

export interface CouponInput {
  type: CouponType;
  value: number;
}

export interface PricingInput {
  participants: ParticipantGroup[];
  priceTiers: PriceTier[];
  coupon?: CouponInput | null;
}

export interface PricingResult {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
}
