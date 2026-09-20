import Link from "next/link";
import styles from "@/components/blog/PostBody.module.css";

/** Reading column: paragraphs split on blank lines, then a way back to the list. */
export function PostBody({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <>
      <div className={styles.body}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Link href="/blog" className={styles.back}>
        <span aria-hidden="true">&larr;</span> Back to the blog
      </Link>
    </>
  );
}
