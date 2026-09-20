import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton";
import { getAllBlogPostsForAdmin } from "@/lib/content/blog";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <Container>
      <Heading level={1}>Blog</Heading>
      <p>
        Write, publish and delete posts. A post without a publish date is a draft and is not visible
        on the site.
      </p>
      <Button href="/admin/blog/new" variant="primary">
        New post
      </Button>
      <table style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Title</th>
            <th style={{ textAlign: "left" }}>Status</th>
            <th style={{ textAlign: "left" }}>Published</th>
            <th style={{ textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.publishedAt ? "Published" : "Draft"}</td>
              <td>
                {post.publishedAt
                  ? post.publishedAt.toLocaleDateString("en-US", { timeZone: "UTC" })
                  : ""}
              </td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                {post.publishedAt && <Link href={`/blog/${post.slug}`}>View</Link>}
                <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                <DeleteBlogPostButton id={post.id} title={post.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
