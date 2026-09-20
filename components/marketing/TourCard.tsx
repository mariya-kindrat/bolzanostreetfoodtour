import Image from "next/image";
import Link from "next/link";
import styles from "@/components/marketing/TourCard.module.css";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";

function TourMeta({ tour }: { tour: TourWithTiers }) {
  const items = [
    describeTourPrice(tour),
    tour.durationLabel,
    tour.daysOffered,
    tour.validityLabel,
  ].filter((m): m is string => Boolean(m));
  return (
    <ul className={styles.meta}>
      {items.map((m) => (
        <li key={m}>{m}</li>
      ))}
    </ul>
  );
}

/** `catalog` adds the price and timing row and the "More details" label used on listing pages. */
export function TourCard({ tour, catalog }: { tour: TourWithTiers; catalog?: boolean }) {
  const photo = tour.heroImageUrl ?? tour.category.photoUrl;
  return (
    <article className={styles.card}>
      <div className={styles.photoWrap}>
        <Image
          src={photo}
          alt=""
          fill
          className={styles.photo}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
        />
      </div>
      <div className={styles.body}>
        <span className={styles.pill}>{tour.category.name}</span>
        <h3 className={styles.title}>{tour.title}</h3>
        <p className={styles.summary}>{tour.summary}</p>
        {catalog && <TourMeta tour={tour} />}
        <Link href={`/tours/${tour.slug}`} className={styles.readMore}>
          {catalog ? "More details" : "Read more"} <span aria-hidden="true">&rarr;</span>
          <span className={styles.srOnly}> about {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
