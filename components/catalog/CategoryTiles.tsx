import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import type { Category } from "@/lib/generated/prisma/client";
import styles from "@/components/catalog/CategoryTiles.module.css";

export function CategoryTiles({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Map<string, number>;
}) {
  return (
    <div className={styles.grid}>
      {categories.map((category) => {
        const count = counts.get(category.id) ?? 0;
        return (
          <Link key={category.id} href={`/${category.slug}`} className={styles.tile}>
            <Image
              src={category.photoUrl}
              alt={category.altText}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div aria-hidden="true" className={styles.scrim} />
            <div className={styles.text}>
              <p className={styles.count}>
                {count} {count === 1 ? "tour" : "tours"}
              </p>
              <Heading level={2} onDark>
                {category.name}
              </Heading>
              <p className={styles.desc}>{category.description}</p>
              <span className={styles.cta}>
                Browse tours <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
