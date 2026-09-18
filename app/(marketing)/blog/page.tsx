import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedBlogPosts } from "@/lib/content/blog";

export const metadata = {
  title: "Blog — Bolzano Street Food Tour",
  description: "Stories, recipes, and travel tips about Bolzano and South Tyrol.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Blog</Heading>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
