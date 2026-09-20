import Link from "next/link";
import type { Category } from "@/lib/generated/prisma/client";
import styles from "@/components/catalog/CategoryChips.module.css";

/** Plain links between listing pages, so filtering needs no client JS. */
export function CategoryChips({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const items: { href: string; label: string; slug?: string }[] = [
    { href: "/tours", label: "All tours" },
    ...categories.map((c) => ({ href: `/${c.slug}`, label: c.name, slug: c.slug })),
  ];

  return (
    <nav aria-label="Tour categories">
      <ul className={styles.chips}>
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.chip} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
