import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import styles from "@/components/marketing/NewsletterSection.module.css";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

export function NewsletterSection() {
  const { eyebrow, heading, body, privacy, photo } = HOMEPAGE_CONTENT.newsletterSection;
  return (
    <div className={styles.band} data-testid="newsletter-band">
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1200px) 100vw, 72rem" />
      <div className={styles.content}>
        <Kicker onDark>{eyebrow}</Kicker>
        <Heading level={2} onDark>
          {heading}
        </Heading>
        <p className={styles.body}>{body}</p>
        <NewsletterForm />
        <Link href={privacy.href} className={styles.privacy}>
          {privacy.label}
        </Link>
      </div>
    </div>
  );
}
