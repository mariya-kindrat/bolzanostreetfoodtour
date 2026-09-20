import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import styles from "@/components/marketing/WineBanner.module.css";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

export function WineBanner() {
  const { eyebrow, heading, paragraphs, badges, cta, photo } = HOMEPAGE_CONTENT.wineSection;
  return (
    <div className={styles.layout} data-testid="wine-accent-panel">
      <div className={styles.photo}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 90vw, 55vw" />
        {badges.map((badge, i) => (
          <div key={badge.name} className={`${styles.badge} ${i === 0 ? styles.top : styles.bottom}`}>
            <span className={styles.badgeLabel}>{badge.label}</span>
            <span className={styles.badgeName}>{badge.name}</span>
          </div>
        ))}
      </div>
      <div>
        <Kicker onSand>{eyebrow}</Kicker>
        <Heading level={2}>{heading}</Heading>
        {paragraphs.map((text) => (
          <p key={text} className={styles.body}>
            {text}
          </p>
        ))}
        <Link href={cta.href} className={styles.cta}>
          {cta.label} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
