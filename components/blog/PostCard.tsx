import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { BlogPost } from "@/lib/generated/prisma/client";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article>
      <Heading level={3}>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </Heading>
      {post.publishedAt && (
        <Text size="sm" muted>
          {post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </Text>
      )}
    </article>
  );
}
