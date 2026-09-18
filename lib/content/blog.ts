import { db } from "@/lib/db";

export function getPublishedBlogPosts() {
  return db.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
}

export function getBlogPostBySlug(slug: string) {
  return db.blogPost.findFirst({ where: { slug, publishedAt: { not: null } } });
}
