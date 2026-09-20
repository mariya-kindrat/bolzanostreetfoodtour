import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isAllowedImageUrl } from "@/lib/content/blogImages";
import styles from "@/components/blog/PostMarkdown.module.css";

/** Admin-authored Markdown. Raw HTML is skipped and images are host-restricted. */
export function PostMarkdown({ content }: { content: string }) {
  return (
    <div className={styles.prose}>
      <Markdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt }) {
            if (typeof src !== "string" || !isAllowedImageUrl(src)) return null;
            // Real dimensions are unknown; CSS height:auto keeps the true aspect ratio.
            return (
              <Image
                src={src}
                alt={alt ?? ""}
                width={1600}
                height={1067}
                sizes="(max-width: 860px) 100vw, 42rem"
                className={styles.image}
              />
            );
          },
          a({ href, children }) {
            const external = typeof href === "string" && /^https?:\/\//.test(href);
            return external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <a href={href}>{children}</a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
