import { formatPriceCents } from "@/lib/content/format";
import type { PriceTier, PriceTierType, Tour } from "@/lib/generated/prisma/client";

type PriceableTour = Pick<Tour, "priceIsFrom" | "priceOnRequest"> & {
  priceTiers: Pick<PriceTier, "type" | "priceCents">[];
};

export function describeTourPrice(tour: PriceableTour): string {
  if (tour.priceOnRequest) return "Price on request";

  const adult = tour.priceTiers.find((t) => t.type === ("ADULT" as PriceTierType));
  if (!adult) return "Contact us for pricing";

  const prefix = tour.priceIsFrom ? "From " : "";
  return `${prefix}${formatPriceCents(adult.priceCents)} / person`;
}
