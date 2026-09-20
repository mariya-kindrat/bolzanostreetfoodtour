import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { getAllBlogPostsForAdmin, getBlogPostById } from "@/lib/content/blog";

describe("blog admin queries", () => {
  const ids: string[] = [];
  afterAll(async () => {
    await db.blogPost.deleteMany({ where: { id: { in: ids } } });
  });

  it("lists drafts as well as published posts, and finds a post by id", async () => {
    const draft = await db.blogPost.create({
      data: { slug: `q-draft-${Date.now()}`, title: "Draft", content: "x" },
    });
    ids.push(draft.id);

    const all = await getAllBlogPostsForAdmin();
    expect(all.map((p) => p.id)).toContain(draft.id);
    expect((await getBlogPostById(draft.id))?.title).toBe("Draft");
    expect(await getBlogPostById("does-not-exist")).toBeNull();
  });
});
