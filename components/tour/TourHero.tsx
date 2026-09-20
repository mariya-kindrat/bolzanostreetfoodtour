import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/TourHero.module.css";

export function TourHero({ tour }: { tour: TourWithTiers }) {
  return (
    <Container>
      <div className={styles.hero}>
        <div className={styles.photo}>
          <Image
            src={tour.heroImageUrl ?? "/images/tours/default-hero.jpg"}
            alt={tour.title}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
          <div aria-hidden="true" className={styles.scrim} />
          <div className={styles.text}>
            <Kicker onDark>{tour.category.name}</Kicker>
            <Heading level={1} as="h1" onDark>
              {tour.title}
            </Heading>
            {tour.daysOffered && <p className={styles.sub}>{tour.daysOffered}</p>}
          </div>
        </div>
        <div className={`${styles.badge} ${styles.price}`}>
          <span className={styles.badgeLabel}>Price</span>
          <span className={styles.badgeValue}>{describeTourPrice(tour)}</span>
        </div>
        {tour.durationLabel && (
          <div className={`${styles.badge} ${styles.duration}`}>
            <span className={styles.badgeLabel}>Duration</span>
            <span className={styles.badgeValue}>{tour.durationLabel}</span>
          </div>
        )}
      </div>
    </Container>
  );
}
