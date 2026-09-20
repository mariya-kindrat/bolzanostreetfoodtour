import Link from "next/link";
import chips from "@/components/catalog/CategoryChips.module.css";
import styles from "@/components/blog/TagFilter.module.css";

/** Plain links between the blog and its tag pages; reuses the category chip styling. */
export function TagFilter({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  if (tags.length === 0) return null;
  const items = [
    { href: "/blog", label: "All", tag: undefined },
    ...tags.map((tag) => ({ href: `/blog/tag/${tag}`, label: tag.replace(/-/g, " "), tag })),
  ];

  return (
    <nav aria-label="Blog tags" className={styles.wrap}>
      <ul className={chips.chips}>
        {items.map((item) => {
          const active = item.tag === activeTag;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${chips.chip} ${active ? chips.active : ""}`}
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
