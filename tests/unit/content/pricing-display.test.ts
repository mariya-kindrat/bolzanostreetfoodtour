import { describe, expect, it } from "vitest";
import { describeTourPrice } from "@/lib/content/pricing-display";
import { PriceTierType } from "@/lib/generated/prisma/client";

const baseTour = {
  priceOnRequest: false,
  priceIsFrom: false,
  priceTiers: [{ type: PriceTierType.ADULT, priceCents: 10900 }],
};

describe("describeTourPrice", () => {
  it("formats a flat adult price", () => {
    expect(describeTourPrice(baseTour as never)).toBe("€109.00 / person");
  });

  it("prefixes 'From' when priceIsFrom is set", () => {
    expect(describeTourPrice({ ...baseTour, priceIsFrom: true } as never)).toBe(
      "From €109.00 / person",
    );
  });

  it("returns 'Price on request' when priceOnRequest is set, ignoring tiers", () => {
    expect(describeTourPrice({ ...baseTour, priceOnRequest: true, priceTiers: [] } as never)).toBe(
      "Price on request",
    );
  });

  it("returns 'Contact us for pricing' when there is no adult tier and no request flag", () => {
    expect(describeTourPrice({ ...baseTour, priceTiers: [] } as never)).toBe(
      "Contact us for pricing",
    );
  });
});
