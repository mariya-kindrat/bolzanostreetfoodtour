import { describe, expect, it } from "vitest";
import {
  extractImageUrls,
  plainText,
  readingMinutes,
  slugify,
  snippet,
} from "@/lib/content/blogText";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Travel Tips")).toBe("travel-tips");
  });

  it("strips diacritics and punctuation", () => {
    expect(slugify("Käse & Wein!")).toBe("kase-wein");
  });

  it("trims leading and trailing separators", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  it("returns an empty string when nothing usable remains", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("plainText", () => {
  it("drops images, keeps link text, removes markup characters", () => {
    const md = "# Title\n\nSome **bold** text ![alt](/a.jpg) and [a link](https://x.test).";
    expect(plainText(md)).toBe("Title Some bold text and a link.");
  });
});

describe("readingMinutes", () => {
  it("is at least 1 minute for very short text", () => {
    expect(readingMinutes("Hello world")).toBe(1);
  });

  it("rounds up at 200 words per minute", () => {
    expect(readingMinutes(Array(201).fill("word").join(" "))).toBe(2);
    expect(readingMinutes(Array(200).fill("word").join(" "))).toBe(1);
  });

  it("does not count image URLs as words", () => {
    const md = `${Array(200).fill("word").join(" ")} ![a long alt text here](/very/long/path.jpg)`;
    expect(readingMinutes(md)).toBe(1);
  });
});

describe("extractImageUrls", () => {
  it("returns every markdown image url", () => {
    const md = '![a](/one.jpg)\n\ntext ![b](https://x.test/two.png "title")';
    expect(extractImageUrls(md)).toEqual(["/one.jpg", "https://x.test/two.png"]);
  });

  it("returns an empty list when there are no images", () => {
    expect(extractImageUrls("just text")).toEqual([]);
  });
});

describe("snippet", () => {
  it("returns the plain text when it fits", () => {
    expect(snippet("Short **text**", 155)).toBe("Short text");
  });

  it("truncates long text to max characters", () => {
    expect(snippet("a".repeat(300), 155)).toHaveLength(155);
  });
});
