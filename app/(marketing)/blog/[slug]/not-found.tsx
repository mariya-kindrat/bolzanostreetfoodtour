import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export default function BlogPostNotFound() {
  return (
    <Container>
      <Heading level={1}>Post not found</Heading>
      <Text>This post doesn&apos;t exist. Browse all posts from the blog index.</Text>
    </Container>
  );
}
