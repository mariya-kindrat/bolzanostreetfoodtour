import Link from "next/link";
import { contactHref } from "@/components/tour/BookingCta";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/BookingCard.module.css";

export function QuoteOnlyNotice({ tour }: { tour: TourWithTiers }) {
  return (
    <aside aria-label="Booking" className={styles.card}>
      <h3 className={styles.price}>{describeTourPrice(tour)}</h3>
      <p className={styles.note}>
        This is a custom, quote-only excursion. Contact us for availability and a personalized
        quote.
      </p>
      <Link href={contactHref(tour.title)} className={styles.cta}>
        Request a quote
      </Link>
    </aside>
  );
}
