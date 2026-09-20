import Link from "next/link";
import { PostMarkdown } from "@/components/blog/PostMarkdown";
import styles from "@/components/blog/PostBody.module.css";

/** Reading column (Markdown), then a way back to the list. */
export function PostBody({ content }: { content: string }) {
  return (
    <>
      <div className={styles.body}>
        <PostMarkdown content={content} />
      </div>
      <Link href="/blog" className={styles.back}>
        <span aria-hidden="true">&larr;</span> Back to the blog
      </Link>
    </>
  );
}
