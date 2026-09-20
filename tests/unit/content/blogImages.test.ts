import { describe, expect, it } from "vitest";
import { isAllowedImageUrl } from "@/lib/content/blogImages";

describe("isAllowedImageUrl", () => {
  it("allows site paths", () => {
    expect(isAllowedImageUrl("/images/home/mosaic/farmhouse-kitchen.jpg")).toBe(true);
  });

  it("rejects protocol-relative urls", () => {
    expect(isAllowedImageUrl("//evil.test/x.jpg")).toBe(false);
  });

  it("allows the Vercel Blob public host over https", () => {
    expect(isAllowedImageUrl("https://abc123.public.blob.vercel-storage.com/blog/x.jpg")).toBe(
      true,
    );
  });

  it("rejects other hosts, http, and lookalike hosts", () => {
    expect(isAllowedImageUrl("https://example.com/x.jpg")).toBe(false);
    expect(isAllowedImageUrl("http://abc.public.blob.vercel-storage.com/x.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://public.blob.vercel-storage.com.evil.test/x.jpg")).toBe(false);
  });

  it("rejects strings that are not urls", () => {
    expect(isAllowedImageUrl("not a url")).toBe(false);
  });
});
