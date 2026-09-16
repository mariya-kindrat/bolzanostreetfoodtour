import { CouponType } from "@/lib/generated/prisma/client";
import type { PriceTierType } from "@/lib/generated/prisma/client";
import type { PricingInput, PricingResult } from "./types";

export class MinimumPersonsError extends Error {
  constructor(public tier: PriceTierType, public required: number, public actual: number) {
    super(`Tier ${tier} requires at least ${required} total participants, got ${actual}`);
    this.name = "MinimumPersonsError";
  }
}

export class UnknownTierError extends Error {
  constructor(public tier: PriceTierType) {
    super(`No price tier configured for ${tier}`);
    this.name = "UnknownTierError";
  }
}

export function calculatePrice(input: PricingInput): PricingResult {
  const totalParticipants = input.participants.reduce((sum, p) => sum + p.count, 0);

  let subtotalCents = 0;
  for (const group of input.participants) {
    if (group.count <= 0) continue;
    const tier = input.priceTiers.find((t) => t.type === group.tier);
    if (!tier) throw new UnknownTierError(group.tier);
    if (totalParticipants < tier.minPersons) {
      throw new MinimumPersonsError(group.tier, tier.minPersons, totalParticipants);
    }
    subtotalCents += tier.priceCents * group.count;
  }

  let discountCents = 0;
  if (input.coupon) {
    discountCents =
      input.coupon.type === CouponType.PERCENTAGE
        ? Math.round((subtotalCents * input.coupon.value) / 100)
        : input.coupon.value;
  }
  discountCents = Math.min(discountCents, subtotalCents);

  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}
