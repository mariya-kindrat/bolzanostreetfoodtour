import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getBlogPostById } from "@/lib/content/blog";

export default async function EditBlogPostPage({ params }: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <Container>
      <Heading level={1}>Edit {post.title}</Heading>
      <BlogPostForm post={post} />
    </Container>
  );
}
