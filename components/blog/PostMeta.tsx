import Link from "next/link";
import { BLOG_AUTHOR } from "@/lib/content/global";
import { readingMinutes } from "@/lib/content/blogText";
import styles from "@/components/blog/PostMeta.module.css";

export function PostMeta({ tags, content }: { tags: string[]; content: string }) {
  return (
    <div className={styles.meta}>
      <p className={styles.byline}>
        By {BLOG_AUTHOR} <span aria-hidden="true">&middot;</span> {readingMinutes(content)} min read
      </p>
      {tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/blog/tag/${tag}`} className={styles.tag}>
                {tag.replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
