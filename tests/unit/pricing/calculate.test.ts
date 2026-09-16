import { describe, expect, it } from "vitest";
import { calculatePrice, MinimumPersonsError, UnknownTierError } from "@/lib/pricing/calculate";
import { CouponType, PriceTierType } from "@/lib/generated/prisma/client";
import type { PriceTier } from "@/lib/generated/prisma/client";

function tier(type: PriceTierType, priceCents: number, minPersons = 1): PriceTier {
  return { id: type, tourId: "t1", type, priceCents, minPersons, createdAt: new Date(), updatedAt: new Date() };
}

const priceTiers = [
  tier(PriceTierType.ADULT, 8000, 1),
  tier(PriceTierType.CHILD, 4000, 2),
  tier(PriceTierType.INFANT, 0, 1),
];

describe("calculatePrice", () => {
  it("prices an adult-only booking", () => {
    const result = calculatePrice({ participants: [{ tier: PriceTierType.ADULT, count: 2 }], priceTiers });
    expect(result.subtotalCents).toBe(16000);
    expect(result.totalCents).toBe(16000);
  });

  it("prices a mixed adult/child/infant booking", () => {
    const result = calculatePrice({
      participants: [
        { tier: PriceTierType.ADULT, count: 2 },
        { tier: PriceTierType.CHILD, count: 2 },
        { tier: PriceTierType.INFANT, count: 1 },
      ],
      priceTiers,
    });
    expect(result.subtotalCents).toBe(2 * 8000 + 2 * 4000);
  });

  it("applies a percentage coupon", () => {
    const result = calculatePrice({
      participants: [{ tier: PriceTierType.ADULT, count: 1 }],
      priceTiers,
      coupon: { type: CouponType.PERCENTAGE, value: 10 },
    });
    expect(result.discountCents).toBe(800);
    expect(result.totalCents).toBe(7200);
  });

  it("applies a fixed-amount coupon", () => {
    const result = calculatePrice({
      participants: [{ tier: PriceTierType.ADULT, count: 1 }],
      priceTiers,
      coupon: { type: CouponType.FIXED, value: 1500 },
    });
    expect(result.totalCents).toBe(6500);
  });

  it("never discounts below zero", () => {
    const result = calculatePrice({
      participants: [{ tier: PriceTierType.ADULT, count: 1 }],
      priceTiers,
      coupon: { type: CouponType.FIXED, value: 999999 },
    });
    expect(result.totalCents).toBe(0);
  });

  it("enforces the minimum-person threshold for a tier", () => {
    expect(() =>
      calculatePrice({ participants: [{ tier: PriceTierType.CHILD, count: 1 }], priceTiers }),
    ).toThrow(MinimumPersonsError);
  });

  it("allows a tier once its minimum-person threshold is met by the total party size", () => {
    const result = calculatePrice({
      participants: [
        { tier: PriceTierType.ADULT, count: 1 },
        { tier: PriceTierType.CHILD, count: 1 },
      ],
      priceTiers,
    });
    expect(result.subtotalCents).toBe(8000 + 4000);
  });

  it("throws for a tier with no configured price", () => {
    expect(() =>
      calculatePrice({ participants: [{ tier: PriceTierType.ADULT, count: 1 }], priceTiers: [] }),
    ).toThrow(UnknownTierError);
  });
});
