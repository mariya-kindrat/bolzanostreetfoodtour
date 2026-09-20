import { PostGrid } from "@/components/blog/PostGrid";
import { TagFilter } from "@/components/blog/TagFilter";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getPublishedBlogPosts, getPublishedTags } from "@/lib/content/blog";

const DESCRIPTION = "Stories, recipes, and travel tips about Bolzano and South Tyrol.";

export const metadata = {
  title: "Blog — Bolzano Street Food Tour",
  description: DESCRIPTION,
};

export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPublishedBlogPosts(), getPublishedTags()]);
  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="Journal"
          title="Blog"
          lead={DESCRIPTION}
          photo={{
            src: "/images/home/mosaic/farmhouse-kitchen.jpg",
            alt: "A vintage farmhouse kitchen with copper cookware and fresh vegetables",
          }}
        />
        <TagFilter tags={tags} />
        <PostGrid posts={posts} />
      </Container>
    </Section>
  );
}
