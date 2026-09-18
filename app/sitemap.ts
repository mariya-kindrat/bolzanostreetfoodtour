import type { MetadataRoute } from "next";
import { getAllTourSlugs } from "@/lib/content/tours";
import { getPublishedBlogPosts } from "@/lib/content/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "/",
  "/cooking-classes",
  "/wine-tours",
  "/winter-tours",
  "/private-transfers",
  "/about",
  "/contact",
  "/blog",
  "/photo-credits",
  "/legal/privacy-policy",
  "/legal/terms-and-booking-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, posts] = await Promise.all([getAllTourSlugs(), getPublishedBlogPosts()]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...slugs.map((slug) => ({ url: `${SITE_URL}/tours/${slug}` })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ?? undefined,
    })),
  ];
}
