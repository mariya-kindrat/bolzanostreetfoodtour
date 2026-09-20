import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/TourBody.module.css";

export function WhatToExpect({ tour }: { tour: TourWithTiers }) {
  if (!tour.whatToExpectFood && !tour.whatToExpectHistory) return null;

  return (
    <div className={styles.block}>
      <Reveal>
        <Heading level={2}>What to expect</Heading>
        <div className={styles.photo}>
          <Image
            src={tour.heroImageUrl ?? "/images/tours/default-hero.jpg"}
            alt=""
            fill
            sizes="(max-width: 860px) 100vw, 60vw"
          />
        </div>
        <div className={styles.columns}>
          {tour.whatToExpectFood && (
            <div>
              <Heading level={4}>Authentic food tasting experience</Heading>
              <p>{tour.whatToExpectFood}</p>
            </div>
          )}
          {tour.whatToExpectHistory && (
            <div>
              <Heading level={4}>Historical and cultural experience</Heading>
              <p>{tour.whatToExpectHistory}</p>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
