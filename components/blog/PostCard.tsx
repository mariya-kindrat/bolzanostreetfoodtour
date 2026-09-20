import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { formatPostMonth } from "@/lib/content/blog";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/blog/PostCard.module.css";

export type PostTone = "cream" | "sand" | "forest";

/** Shows the cover and excerpt when a post has them; otherwise a typographic card. */
export function PostCard({
  post,
  tone = "cream",
  featured,
}: {
  post: BlogPost;
  tone?: PostTone;
  featured?: boolean;
}) {
  const classes = [styles.card, styles[tone], featured ? styles.featured : ""].join(" ");
  return (
    <article className={classes}>
      {post.coverImageUrl && (
        <div className={styles.photo}>
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? ""}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
        </div>
      )}
      <div className={styles.text}>
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
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <ul className={styles.tags}>
            {post.tags.map((tag) => (
              <li key={tag}>{tag.replace(/-/g, " ")}</li>
            ))}
          </ul>
        )}
        <span className={styles.more} aria-hidden="true">
          Read story &rarr;
        </span>
      </div>
    </article>
  );
}
