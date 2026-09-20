import Image from "next/image";
import Link from "next/link";
import { ABOUT_CONTENT } from "@/lib/content/about-contact";
import styles from "@/components/about/AboutStory.module.css";

export function AboutStory() {
  const { paragraphs, signOff } = ABOUT_CONTENT;
  return (
    <div className={styles.layout}>
      <div className={styles.photo}>
        <Image
          src="/images/home/mosaic/market-cheese-vendor.jpg"
          alt="A vendor slicing Parmigiano at a market stall in Bolzano"
          fill
          sizes="(max-width: 860px) 90vw, 40vw"
        />
      </div>
      <div className={styles.text}>
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className={styles.sign}>{signOff}</p>
        <Link href="/tours" className={styles.cta}>
          See our tours <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
