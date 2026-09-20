import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { POST } from "@/app/api/admin/blog/route";
import { PATCH, DELETE } from "@/app/api/admin/blog/[id]/route";

// revalidatePath needs a running Next.js request context, so it is mocked
// and asserted on. Route handlers are called directly, so these tests never
// go through middleware.ts's Clerk check (same as categories-api.test.ts).
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function jsonRequest(method: string, body: unknown): Request {
  return new Request("http://localhost/api/admin/blog", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    title: "Integration post",
    slug: `it-post-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    content: "Body text for an integration test.",
    tags: "Recipes, Travel Tips",
    ...overrides,
  };
}

describe("blog admin API", () => {
  const createdIds: string[] = [];
  afterEach(async () => {
    await db.blogPost.deleteMany({ where: { id: { in: createdIds.splice(0) } } });
  });

  async function create(overrides: Record<string, unknown> = {}) {
    const res = await POST(jsonRequest("POST", validBody(overrides)));
    const data = (await res.json()) as { post: { id: string; slug: string } };
    createdIds.push(data.post.id);
    return { res, post: data.post };
  }

  it("creates a draft with normalised tags and revalidates the blog", async () => {
    const { res } = await create();
    expect(res.status).toBe(200);
    const saved = await db.blogPost.findFirstOrThrow({ where: { id: createdIds[0] } });
    expect(saved.publishedAt).toBeNull();
    expect(saved.tags).toEqual(["recipes", "travel-tips"]);
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
  });

  it("publishes with a date when published is true", async () => {
    await create({ published: true });
    const saved = await db.blogPost.findFirstOrThrow({ where: { id: createdIds[0] } });
    expect(saved.publishedAt).not.toBeNull();
  });

  it("returns 400 for the reserved slug and for a remote cover", async () => {
    expect((await POST(jsonRequest("POST", validBody({ slug: "tag" })))).status).toBe(400);
    const remote = validBody({ coverImageUrl: "https://example.com/x.jpg", coverImageAlt: "x" });
    expect((await POST(jsonRequest("POST", remote))).status).toBe(400);
  });

  it("returns 409 for a duplicate slug", async () => {
    const { post } = await create();
    const res = await POST(jsonRequest("POST", validBody({ slug: post.slug })));
    expect(res.status).toBe(409);
  });

  it("updates a post, and returns 404 for an unknown id", async () => {
    const { post } = await create();
    const res = await PATCH(
      jsonRequest("PATCH", validBody({ slug: post.slug, title: "Renamed" })),
      ctx(post.id),
    );
    expect(res.status).toBe(200);
    expect((await db.blogPost.findFirstOrThrow({ where: { id: post.id } })).title).toBe("Renamed");

    const missing = await PATCH(jsonRequest("PATCH", validBody()), ctx("does-not-exist"));
    expect(missing.status).toBe(404);
  });

  it("deletes a post, and returns 404 the second time", async () => {
    const { post } = await create();
    expect((await DELETE(jsonRequest("DELETE", {}), ctx(post.id))).status).toBe(200);
    expect(await db.blogPost.findFirst({ where: { id: post.id } })).toBeNull();
    expect((await DELETE(jsonRequest("DELETE", {}), ctx(post.id))).status).toBe(404);
  });
});
