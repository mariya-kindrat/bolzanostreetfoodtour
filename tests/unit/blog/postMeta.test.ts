import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostMeta } from "@/components/blog/PostMeta";
import { BLOG_AUTHOR } from "@/lib/content/global";

function render(props: { tags: string[]; content: string }) {
  return renderToStaticMarkup(createElement(PostMeta, props));
}

describe("PostMeta", () => {
  it("shows the byline and reading time", () => {
    const html = render({ tags: [], content: "A short post." });
    expect(html).toContain(`By ${BLOG_AUTHOR}`);
    expect(html).toContain("1 min read");
  });

  it("links each tag to its tag page with hyphens shown as spaces", () => {
    const html = render({ tags: ["travel-tips", "recipes"], content: "Body." });
    expect(html).toContain('href="/blog/tag/travel-tips"');
    expect(html).toContain("travel tips");
    expect(html).toContain('href="/blog/tag/recipes"');
  });

  it("renders no tag list when there are no tags", () => {
    expect(render({ tags: [], content: "Body." })).not.toContain("<ul");
  });
});
