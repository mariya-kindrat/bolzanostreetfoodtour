import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";

export function BookingWidgetComingSoon({ tour }: { tour: TourWithTiers }) {
  return (
    <aside
      aria-label="Booking"
      style={{
        border: "1px solid var(--color-cream-dark)",
        borderRadius: "12px",
        padding: "1.5rem",
        position: "sticky",
        top: "1rem",
      }}
    >
      <Heading level={3}>{describeTourPrice(tour)}</Heading>
      <Text>Online booking is coming soon. In the meantime, contact us to reserve your spot.</Text>
      <Link href="/contact">Contact us</Link>
    </aside>
  );
}
