import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoreStories } from "@/components/blog/MoreStories";
import { PostBody } from "@/components/blog/PostBody";
import { PostMeta } from "@/components/blog/PostMeta";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  formatPostMonth,
  getBlogPostBySlug,
  getMorePosts,
  getPublishedBlogPosts,
} from "@/lib/content/blog";
import { snippet } from "@/lib/content/blogText";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Bolzano Street Food Tour Blog`,
    description: post.excerpt ?? snippet(post.content),
    openGraph: post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const more = await getMorePosts(post, 3);

  return (
    <>
      <Section tone="white">
        <Container>
          <CatalogHeader
            eyebrow={post.publishedAt ? formatPostMonth(post.publishedAt) : "Journal"}
            title={post.title}
            photo={
              post.coverImageUrl
                ? { src: post.coverImageUrl, alt: post.coverImageAlt ?? "" }
                : undefined
            }
          />
          <PostMeta tags={post.tags} content={post.content} />
          <PostBody content={post.content} />
        </Container>
      </Section>
      <MoreStories posts={more} />
    </>
  );
}
