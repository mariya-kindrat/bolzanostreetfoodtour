import { PostCard, type PostTone } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import type { BlogPost } from "@/lib/generated/prisma/client";
import styles from "@/components/blog/MoreStories.module.css";

// Cream cards vanish on the cream-dark section, so this strip skips that tone.
const TONES: PostTone[] = ["cream", "forest", "cream"];

export function MoreStories({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <Section tone="sand">
      <Container>
        <Kicker onSand>Keep reading</Kicker>
        <Heading level={2}>More stories</Heading>
        <div className={styles.grid}>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} tone={TONES[i % TONES.length]} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
