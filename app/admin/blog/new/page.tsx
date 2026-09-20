import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export default function NewBlogPostPage() {
  return (
    <Container>
      <Heading level={1}>New post</Heading>
      <BlogPostForm />
    </Container>
  );
}
