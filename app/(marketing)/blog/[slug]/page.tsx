import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoreStories } from "@/components/blog/MoreStories";
import { PostBody } from "@/components/blog/PostBody";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  formatPostMonth,
  getBlogPostBySlug,
  getMorePosts,
  getPublishedBlogPosts,
} from "@/lib/content/blog";

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
    description: post.content.slice(0, 155),
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
          />
          <PostBody content={post.content} />
        </Container>
      </Section>
      <MoreStories posts={more} />
    </>
  );
}
