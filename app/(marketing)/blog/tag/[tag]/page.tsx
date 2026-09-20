import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/blog/PostGrid";
import { TagFilter } from "@/components/blog/TagFilter";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getPublishedPostsByTag, getPublishedTags } from "@/lib/content/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tags = await getPublishedTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const label = tag.replace(/-/g, " ");
  return {
    title: `${label} — Bolzano Street Food Tour Blog`,
    description: `Stories about ${label} from Bolzano and South Tyrol.`,
  };
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await params;
  const [posts, tags] = await Promise.all([getPublishedPostsByTag(tag), getPublishedTags()]);
  if (posts.length === 0) notFound();

  return (
    <Section tone="white">
      <Container>
        <CatalogHeader eyebrow="Journal" title={tag.replace(/-/g, " ")} />
        <TagFilter tags={tags} activeTag={tag} />
        <PostGrid posts={posts} />
      </Container>
    </Section>
  );
}
