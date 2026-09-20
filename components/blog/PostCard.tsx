import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { formatPostMonth } from "@/lib/content/blog";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/blog/PostCard.module.css";

export type PostTone = "cream" | "sand" | "forest";

/** Typographic card: posts have no images, so the tone carries the variety. */
export function PostCard({
  post,
  tone = "cream",
  featured,
}: {
  post: BlogPost;
  tone?: PostTone;
  featured?: boolean;
}) {
  return (
    <article className={`${styles.card} ${styles[tone]} ${featured ? styles.featured : ""}`}>
      {post.publishedAt && (
        <time className={styles.date} dateTime={post.publishedAt.toISOString()}>
          {formatPostMonth(post.publishedAt)}
        </time>
      )}
      <Heading level={featured ? 2 : 3} as="h2" onDark={tone === "forest"}>
        <Link href={`/blog/${post.slug}`} className={styles.link}>
          {post.title}
        </Link>
      </Heading>
      <span className={styles.more} aria-hidden="true">
        Read story &rarr;
      </span>
    </article>
  );
}
