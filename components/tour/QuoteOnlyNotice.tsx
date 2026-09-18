import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";

export function QuoteOnlyNotice({ tour }: { tour: TourWithTiers }) {
  return (
    <aside
      aria-label="Booking"
      style={{
        border: "1px solid var(--color-cream-dark)",
        borderRadius: "12px",
        padding: "1.5rem",
      }}
    >
      <Heading level={3}>{describeTourPrice(tour)}</Heading>
      <Text>
        This is a custom, quote-only excursion. Contact us for availability and a personalized
        quote.
      </Text>
      <Link href="/contact">Contact us</Link>
    </aside>
  );
}
