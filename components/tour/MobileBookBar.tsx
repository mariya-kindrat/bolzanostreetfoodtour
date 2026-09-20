import Link from "next/link";
import { contactHref } from "@/components/tour/BookingCta";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/BookingCard.module.css";

export function MobileBookBar({ tour, label }: { tour: TourWithTiers; label: string }) {
  return (
    <div className={styles.bar}>
      <span className={styles.barPrice}>{describeTourPrice(tour)}</span>
      <Link href={contactHref(tour.title)} className={styles.cta}>
        {label}
      </Link>
    </div>
  );
}
