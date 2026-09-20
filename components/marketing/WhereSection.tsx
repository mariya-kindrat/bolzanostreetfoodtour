import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import styles from "@/components/marketing/WhereSection.module.css";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

export function WhereSection() {
  const { eyebrow, heading, body, transfersNote, compass, cta, photo } =
    HOMEPAGE_CONTENT.whereIsItSection;
  return (
    <div data-testid="where-section">
      <div className={styles.photo}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1200px) 100vw, 72rem" />
        <span className={styles.caption}>{photo.caption}</span>
      </div>
      <div className={styles.card}>
        <Kicker>{eyebrow}</Kicker>
        <Heading level={2}>{heading}</Heading>
        <p className={styles.body}>{body}</p>
        <ul className={styles.compass}>
          {compass.map((point) => (
            <li key={point.letter}>
              <span className={styles.letter} aria-hidden="true">
                {point.letter}
              </span>
              <span className={styles.srOnly}>{point.direction}: </span>
              {point.place}
            </li>
          ))}
        </ul>
        <p className={styles.body}>{transfersNote}</p>
        <Link href={cta.href} className={styles.cta}>
          {cta.label} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
