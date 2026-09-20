import { isAllowedImageUrl } from "@/lib/content/blogImages";
import { extractImageUrls, slugify } from "@/lib/content/blogText";

export interface BlogBody {
  title?: string;
  slug?: string;
  excerpt?: string;
  /** Comma-separated, as typed in the admin form. */
  tags?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  content?: string;
  published?: boolean;
  publishedAt?: string;
}

export interface ValidatedBlogFields {
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  content: string;
  publishedAt: Date | null;
}

export type BlogValidation = { fields: ValidatedBlogFields } | { error: string };

// "tag" is reserved because /blog/tag/[tag] exists next to /blog/[slug].
const RESERVED_SLUGS = new Set(["tag"]);
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_TITLE = 150;
const MAX_EXCERPT = 300;
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 30;

export function normalizeTags(input: string): string[] {
  return [...new Set(input.split(",").map(slugify).filter(Boolean))];
}

function parsePublishedAt(value: string | undefined, now: Date): Date {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : now;
}

// Pure validation, no I/O. `now` is injectable so publishing is deterministic in tests.
export function validateBlogBody(body: BlogBody, now: Date = new Date()): BlogValidation {
  const title = body.title?.trim();
  const slug = body.slug?.trim();
  const content = body.content?.trim();
  if (!title || !slug || !content) return { error: "Title, slug, and body are required." };
  if (title.length > MAX_TITLE) return { error: `Title must be at most ${MAX_TITLE} characters.` };
  if (!SLUG_PATTERN.test(slug)) {
    return { error: "Slug may only contain lowercase letters, digits, and single hyphens." };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { error: `"${slug}" is reserved for another page. Choose a different slug.` };
  }

  const excerpt = body.excerpt?.trim() || null;
  if (excerpt && excerpt.length > MAX_EXCERPT) {
    return { error: `Excerpt must be at most ${MAX_EXCERPT} characters.` };
  }

  const tags = normalizeTags(body.tags ?? "");
  if (tags.length > MAX_TAGS) return { error: `Use at most ${MAX_TAGS} tags.` };
  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
    return { error: `Each tag must be at most ${MAX_TAG_LENGTH} characters.` };
  }

  const coverImageUrl = body.coverImageUrl?.trim() || null;
  const coverImageAlt = body.coverImageAlt?.trim() || null;
  if (coverImageUrl && !isAllowedImageUrl(coverImageUrl)) {
    return { error: "Cover photo must be an uploaded photo or a site path." };
  }
  if (coverImageUrl && !coverImageAlt) return { error: "Cover photo needs alt text." };
  if (extractImageUrls(content).some((url) => !isAllowedImageUrl(url))) {
    return { error: "Photos in the body must be uploaded here or be site paths." };
  }

  return {
    fields: {
      title,
      slug,
      excerpt,
      tags,
      coverImageUrl,
      coverImageAlt: coverImageUrl ? coverImageAlt : null,
      content,
      publishedAt: body.published ? parsePublishedAt(body.publishedAt, now) : null,
    },
  };
}
