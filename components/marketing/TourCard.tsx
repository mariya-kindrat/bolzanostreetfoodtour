import Image from "next/image";
import Link from "next/link";
import styles from "@/components/marketing/TourCard.module.css";
import type { TourWithTiers } from "@/lib/content/tours";

export function TourCard({ tour }: { tour: TourWithTiers }) {
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
        <Link href={`/tours/${tour.slug}`} className={styles.readMore}>
          Read more <span aria-hidden="true">&rarr;</span>
          <span className={styles.srOnly}> about {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
