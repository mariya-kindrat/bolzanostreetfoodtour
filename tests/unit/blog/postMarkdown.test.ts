import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PostMarkdown } from "@/components/blog/PostMarkdown";

// next/image needs Next's runtime image config; a plain img is enough here.
vi.mock("next/image", async () => {
  const { createElement: h } = await import("react");
  return {
    default: (props: { src: string; alt: string }) => h("img", { src: props.src, alt: props.alt }),
  };
});

function render(content: string) {
  return renderToStaticMarkup(createElement(PostMarkdown, { content }));
}

describe("PostMarkdown", () => {
  it("renders headings, emphasis and lists", () => {
    const html = render("## Heading\n\nSome **bold** text.\n\n- one\n- two");
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<li>one</li>");
  });

  it("renders an image from a site path or the Blob host", () => {
    const html = render(
      "![Kitchen](/images/k.jpg)\n\n![Blob](https://abc.public.blob.vercel-storage.com/b.jpg)",
    );
    expect(html).toContain('src="/images/k.jpg"');
    expect(html).toContain('alt="Kitchen"');
    expect(html).toContain("abc.public.blob.vercel-storage.com/b.jpg");
  });

  it("drops an image from a disallowed host", () => {
    expect(render("![Bad](https://example.com/x.jpg)")).not.toContain("<img");
  });

  it("does not render raw HTML", () => {
    const html = render("Before <script>alert(1)</script> after");
    expect(html).not.toContain("<script");
  });

  it("opens external links safely and leaves internal links alone", () => {
    const html = render("[out](https://example.com) and [in](/tours)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('href="/tours"');
  });
});
