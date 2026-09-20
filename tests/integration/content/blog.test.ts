import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  getAllBlogPostsForAdmin,
  getBlogPostById,
  getPublishedPostsByTag,
} from "@/lib/content/blog";

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

describe("getPublishedPostsByTag", () => {
  const ids: string[] = [];
  afterAll(async () => {
    await db.blogPost.deleteMany({ where: { id: { in: ids } } });
  });

  it("returns only published posts carrying the tag, newest first", async () => {
    const tag = `it-tag-${Date.now()}`;
    const make = (suffix: string, publishedAt: Date | null) =>
      db.blogPost.create({
        data: { slug: `${tag}-${suffix}`, title: suffix, content: "x", tags: [tag], publishedAt },
      });
    const older = await make("older", new Date("2020-01-01T12:00:00Z"));
    const newer = await make("newer", new Date("2021-01-01T12:00:00Z"));
    const draft = await make("draft", null);
    ids.push(older.id, newer.id, draft.id);

    const posts = await getPublishedPostsByTag(tag);
    expect(posts.map((p) => p.id)).toEqual([newer.id, older.id]);
  });
});
