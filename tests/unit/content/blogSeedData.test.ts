import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateBlogBody } from "@/lib/admin/blogValidation";
import { extractImageUrls } from "@/lib/content/blogText";
import { BLOG_PLACEHOLDER_BODY, BLOG_POSTS } from "../../../prisma/blogPosts";

const EXPECTED_SLUGS = [
  "thanksgiving-south-tyrol-style",
  "elderflower-syrup-facts-and-myths",
  "armchair-travel-books-south-tyrol",
  "10-reasons-to-visit-south-tyrol",
  "stollen-or-zelten",
  "christmas-traditions-south-tyrol",
  "eat-drink-court-of-king-laurin",
  "24-hours-in-bolzano-through-local-eyes",
];

function asBody(post: (typeof BLOG_POSTS)[number]) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags.join(","),
    coverImageUrl: post.coverImageUrl,
    coverImageAlt: post.coverImageAlt,
    content: post.content,
    published: true,
    publishedAt: `${post.publishedAt}T12:00:00Z`,
  };
}

describe("blog seed data", () => {
  it("keeps the 8 migrated posts, in a stable set of slugs", () => {
    expect(BLOG_POSTS.map((p) => p.slug).sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it.each(BLOG_POSTS)("$slug passes the same validation as the admin form", (post) => {
    const result = validateBlogBody(asBody(post));
    expect("fields" in result).toBe(true);
    if ("fields" in result) expect(result.fields.tags).toEqual(post.tags);
  });

  it.each(BLOG_POSTS)("$slug has real copy, an excerpt, a cover and an inline photo", (post) => {
    expect(post.content).not.toBe(BLOG_PLACEHOLDER_BODY);
    expect(post.content.length).toBeGreaterThan(600);
    expect(post.excerpt.length).toBeGreaterThan(40);
    expect(post.tags.length).toBeGreaterThan(0);
    expect(extractImageUrls(post.content).length).toBeGreaterThan(0);
  });

  it.each(BLOG_POSTS)("$slug only references photos that exist in public/", (post) => {
    const urls = [post.coverImageUrl, ...extractImageUrls(post.content)];
    for (const url of urls) expect(existsSync(join("public", url))).toBe(true);
  });
});
