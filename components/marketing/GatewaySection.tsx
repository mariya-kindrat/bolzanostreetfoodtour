import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { Text } from "@/components/ui/Text";
import styles from "@/components/marketing/GatewaySection.module.css";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

export function GatewaySection() {
  const { eyebrow, heading, body, photos } = HOMEPAGE_CONTENT.gatewaySection;
  return (
    <div data-testid="gateway-section">
      <div className={styles.header}>
        <Kicker>{eyebrow}</Kicker>
        <Heading level={2}>{heading}</Heading>
        <Text muted>{body}</Text>
      </div>
      <div className={styles.pair}>
        {photos.map((photo) => (
          <figure key={photo.name} className={styles.figure}>
            <div className={styles.frame}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 700px) 90vw, 45vw"
                style={{ objectPosition: photo.position }}
              />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.language}>{photo.language}</span>
              <span className={styles.name}>{photo.name}</span>
            </figcaption>
          </figure>
        ))}
        <span className={styles.seam} aria-hidden="true">
          &amp;
        </span>
      </div>
    </div>
  );
}
