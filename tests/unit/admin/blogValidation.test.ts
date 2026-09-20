import { describe, expect, it } from "vitest";
import { normalizeTags, validateBlogBody, type BlogBody } from "@/lib/admin/blogValidation";

const NOW = new Date("2026-09-20T10:00:00Z");
const BLOB = "https://abc.public.blob.vercel-storage.com/blog/x.jpg";

function body(overrides: Partial<BlogBody> = {}): BlogBody {
  return { title: "A post", slug: "a-post", content: "Some body text.", ...overrides };
}

function errorOf(overrides: Partial<BlogBody>) {
  const result = validateBlogBody(body(overrides), NOW);
  if (!("error" in result)) throw new Error("expected an error");
  return result.error;
}

describe("normalizeTags", () => {
  it("slugifies, drops empties and dedupes", () => {
    expect(normalizeTags("Recipes, Travel Tips, recipes, ,")).toEqual(["recipes", "travel-tips"]);
  });

  it("returns an empty list for an empty string", () => {
    expect(normalizeTags("")).toEqual([]);
  });
});

describe("validateBlogBody", () => {
  it("accepts a minimal draft", () => {
    const result = validateBlogBody(body(), NOW);
    expect(result).toEqual({
      fields: {
        title: "A post",
        slug: "a-post",
        excerpt: null,
        tags: [],
        coverImageUrl: null,
        coverImageAlt: null,
        content: "Some body text.",
        publishedAt: null,
      },
    });
  });

  it("requires title, slug and body", () => {
    expect(errorOf({ title: " " })).toMatch(/required/);
    expect(errorOf({ slug: "" })).toMatch(/required/);
    expect(errorOf({ content: "" })).toMatch(/required/);
  });

  it("rejects an over-long title", () => {
    expect(errorOf({ title: "x".repeat(151) })).toMatch(/150/);
  });

  it("rejects a malformed or reserved slug", () => {
    expect(errorOf({ slug: "Bad Slug" })).toMatch(/lowercase/);
    expect(errorOf({ slug: "tag" })).toMatch(/reserved/);
  });

  it("rejects an over-long excerpt", () => {
    expect(errorOf({ excerpt: "x".repeat(301) })).toMatch(/300/);
  });

  it("rejects too many or too long tags", () => {
    expect(errorOf({ tags: "a,b,c,d,e,f,g,h,i" })).toMatch(/8 tags/);
    expect(errorOf({ tags: "x".repeat(31) })).toMatch(/30 characters/);
  });

  it("accepts a cover on the Blob host or a site path, and requires alt text", () => {
    const ok = validateBlogBody(body({ coverImageUrl: BLOB, coverImageAlt: "Alt" }), NOW);
    expect("fields" in ok && ok.fields.coverImageUrl).toBe(BLOB);
    expect(errorOf({ coverImageUrl: "/images/x.jpg" })).toMatch(/alt text/);
    expect(errorOf({ coverImageUrl: "https://example.com/x.jpg", coverImageAlt: "Alt" })).toMatch(
      /Cover photo/,
    );
  });

  it("drops the alt text when there is no cover", () => {
    const result = validateBlogBody(body({ coverImageAlt: "Orphan alt" }), NOW);
    expect("fields" in result && result.fields.coverImageAlt).toBeNull();
  });

  it("rejects inline images from disallowed hosts", () => {
    expect(errorOf({ content: "![x](https://example.com/x.jpg)" })).toMatch(/Photos in the body/);
    const ok = validateBlogBody(body({ content: `![x](${BLOB})` }), NOW);
    expect("fields" in ok).toBe(true);
  });

  it("publishes with the given date, falling back to now for a missing or invalid one", () => {
    const given = validateBlogBody(
      body({ published: true, publishedAt: "2020-10-01T12:00:00.000Z" }),
      NOW,
    );
    expect("fields" in given && given.fields.publishedAt).toEqual(
      new Date("2020-10-01T12:00:00.000Z"),
    );
    const missing = validateBlogBody(body({ published: true }), NOW);
    expect("fields" in missing && missing.fields.publishedAt).toEqual(NOW);
    const invalid = validateBlogBody(body({ published: true, publishedAt: "garbage" }), NOW);
    expect("fields" in invalid && invalid.fields.publishedAt).toEqual(NOW);
  });

  it("ignores publishedAt for a draft", () => {
    const result = validateBlogBody(body({ published: false, publishedAt: "2020-01-01" }), NOW);
    expect("fields" in result && result.fields.publishedAt).toBeNull();
  });
});
