import { PostCard, type PostTone } from "@/components/blog/PostCard";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/blog/PostGrid.module.css";

const TONES: PostTone[] = ["cream", "sand", "forest"];

/** The newest post leads as a wide forest card; the rest cycle through the tones. */
export function PostGrid({ posts }: { posts: BlogPost[] }) {
  const [latest, ...rest] = posts;
  if (!latest) return null;
  return (
    <div className={styles.grid}>
      <div className={styles.lead}>
        <PostCard post={latest} tone="forest" featured />
      </div>
      {rest.map((post, i) => (
        <PostCard key={post.id} post={post} tone={TONES[i % TONES.length]} />
      ))}
    </div>
  );
}
