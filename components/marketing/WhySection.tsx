import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import styles from "@/components/marketing/WhySection.module.css";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

export function WhySection() {
  const { eyebrow, heading, body, senses, photos } = HOMEPAGE_CONTENT.whySection;
  return (
    <div className={styles.layout} data-testid="why-section">
      <div>
        <Kicker>{eyebrow}</Kicker>
        <Heading level={2}>{heading}</Heading>
        <p className={styles.body}>{body}</p>
        <ul className={styles.senses} aria-label="The five senses">
          {senses.map((sense) => (
            <li key={sense}>{sense}</li>
          ))}
        </ul>
      </div>
      <div className={styles.photos}>
        <div className={styles.large}>
          <Image src={photos[0].src} alt={photos[0].alt} fill sizes="(max-width: 860px) 90vw, 40vw" />
        </div>
        <div className={styles.small}>
          <Image src={photos[1].src} alt={photos[1].alt} fill sizes="(max-width: 860px) 45vw, 20vw" />
        </div>
      </div>
    </div>
  );
}
