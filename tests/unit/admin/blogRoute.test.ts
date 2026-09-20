import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { readBlogBody, revalidateBlog } from "@/lib/admin/blogRoute";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

describe("readBlogBody", () => {
  it("returns the parsed JSON body", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ title: "Hi" }),
    });
    expect(await readBlogBody(request)).toEqual({ title: "Hi" });
  });

  it("returns null for invalid JSON", async () => {
    const request = new Request("http://localhost", { method: "POST", body: "{nope" });
    expect(await readBlogBody(request)).toBeNull();
  });
});

describe("revalidateBlog", () => {
  it("revalidates the list, the post, the tag pages and the sitemap", () => {
    revalidateBlog("my-post");
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/my-post");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/tag/[tag]", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });
});
