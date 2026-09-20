"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostMarkdown } from "@/components/blog/PostMarkdown";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { slugify } from "@/lib/content/blogText";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/admin/BlogPostForm.module.css";

// Plain native elements read via state, then sent to the route handlers with
// fetch, the same convention as CategoryForm.
export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(Boolean(post?.publishedAt));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body = {
      title,
      slug,
      excerpt,
      tags,
      content,
      published,
      publishedAt: post?.publishedAt?.toISOString(),
    };
    const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";

    let res: Response;
    try {
      res = await fetch(url, {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label htmlFor="title">Title</label>
        <br />
        <input
          id="title"
          type="text"
          required
          maxLength={150}
          value={title}
          onChange={(e) => handleTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="slug">
          Slug (the post&apos;s URL, e.g. <code>my-story</code> renders at{" "}
          <code>/blog/my-story</code>)
        </label>
        <br />
        <input
          id="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="excerpt">Excerpt (short summary shown on the blog cards, max 300)</label>
        <br />
        <textarea
          id="excerpt"
          rows={3}
          maxLength={300}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tags">Tags (comma-separated, up to 8, e.g. recipes, travel tips)</label>
        <br />
        <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className={styles.editor}>
        <div>
          <label htmlFor="content">
            Body (Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list</code>,{" "}
            <code>[link](https://...)</code>)
          </label>
          <br />
          <textarea
            id="content"
            rows={20}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <p className={styles.previewLabel}>Preview</p>
          <div className={styles.preview}>
            <PostMarkdown content={content || "Nothing to preview yet."} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="published">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />{" "}
          Published (visible on the site; unchecked is a draft)
        </label>
      </div>

      <Button variant="primary" type="submit">
        {submitting ? "Saving..." : post ? "Save changes" : "Create post"}
      </Button>
      {error && <Text size="sm">{error}</Text>}
    </form>
  );
}
