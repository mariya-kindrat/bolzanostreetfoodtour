import { db } from "@/lib/db";
import type { BlogPost } from "@/lib/generated/prisma/client";

export function getPublishedBlogPosts() {
  return db.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
}

export function getBlogPostBySlug(slug: string) {
  return db.blogPost.findFirst({ where: { slug, publishedAt: { not: null } } });
}

/** Other posts in the given (newest-first) order, capped at `max`. */
export function pickMorePosts<T extends { id: string }>(current: T, all: T[], max: number): T[] {
  return all.filter((p) => p.id !== current.id).slice(0, max);
}

export async function getMorePosts(current: BlogPost, max: number) {
  return pickMorePosts(current, await getPublishedBlogPosts(), max);
}

/** Month and year in UTC: migrated dates are approximate first-of-month timestamps. */
export function formatPostMonth(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });
}

// Admin reads every post, drafts included, unlike the public helpers above.
export function getAllBlogPostsForAdmin() {
  return db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export function getBlogPostById(id: string) {
  return db.blogPost.findUnique({ where: { id } });
}
