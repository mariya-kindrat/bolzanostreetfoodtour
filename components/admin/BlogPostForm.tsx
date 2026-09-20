"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadPhoto } from "@/components/admin/uploadPhoto";
import { PostMarkdown } from "@/components/blog/PostMarkdown";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { fromDateInputValue, toDateInputValue } from "@/lib/admin/publishDate";
import { insertAtCursor } from "@/lib/admin/textInsert";
import { slugify } from "@/lib/content/blogText";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/admin/BlogPostForm.module.css";

// Plain native elements read via state, then sent to the route handlers with
// fetch, the same convention as CategoryForm.
export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(Boolean(post?.publishedAt));
  const [publishedDate, setPublishedDate] = useState(toDateInputValue(post?.publishedAt));
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function upload(file: File): Promise<string | null> {
    setError(null);
    setUploading(true);
    try {
      return await uploadPhoto(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (url) setCoverImageUrl(url);
  }

  async function handleBodyPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (!url) return;
    const area = bodyRef.current;
    const start = area?.selectionStart ?? content.length;
    const end = area?.selectionEnd ?? content.length;
    const next = insertAtCursor(
      area?.value ?? content,
      start,
      end,
      `![Describe this photo](${url})`,
    );
    setContent(next.text);
    requestAnimationFrame(() => area?.setSelectionRange(next.cursor, next.cursor));
  }

  function handlePublished(checked: boolean) {
    setPublished(checked);
    if (checked && !publishedDate) setPublishedDate(toDateInputValue(new Date()));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || uploading) return;
    setError(null);
    setSubmitting(true);

    const body = {
      title,
      slug,
      excerpt,
      tags,
      coverImageUrl,
      coverImageAlt,
      content,
      published,
      publishedAt: fromDateInputValue(publishedDate),
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

      <fieldset className={styles.cover}>
        <legend>Cover photo (shown at the top of the post and on its card)</legend>
        {coverImageUrl && (
          <div className={styles.coverPreview}>
            <Image src={coverImageUrl} alt="" fill sizes="20rem" />
          </div>
        )}
        <label htmlFor="cover-file">Choose a photo (JPEG, PNG or WebP)</label>
        <input
          id="cover-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleCover}
        />
        {coverImageUrl && (
          <>
            <label htmlFor="cover-alt">Cover photo description (for screen readers)</label>
            <input
              id="cover-alt"
              type="text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
            />
            <button type="button" onClick={() => setCoverImageUrl("")}>
              Remove cover photo
            </button>
          </>
        )}
      </fieldset>

      <div className={styles.editor}>
        <div>
          <label htmlFor="content">
            Body (Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list</code>,{" "}
            <code>[link](https://...)</code>)
          </label>
          <br />
          <textarea
            id="content"
            ref={bodyRef}
            rows={20}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label htmlFor="body-photo">
            Add a photo at the cursor (then edit the words in the brackets to describe it)
          </label>
          <input
            id="body-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBodyPhoto}
          />
          {uploading && <Text size="sm">Uploading...</Text>}
        </div>
        <div className={styles.preview} role="region" aria-label="Preview">
          <PostMarkdown content={content || "Nothing to preview yet."} />
        </div>
      </div>

      <div>
        <label htmlFor="published">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => handlePublished(e.target.checked)}
          />{" "}
          Published (visible on the site; unchecked is a draft)
        </label>
        {published && (
          <div>
            <label htmlFor="published-date">Publish date</label>
            <br />
            <input
              id="published-date"
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <Button variant="primary" type="submit">
        {submitting ? "Saving..." : post ? "Save changes" : "Create post"}
      </Button>
      {error && <Text size="sm">{error}</Text>}
    </form>
  );
}
