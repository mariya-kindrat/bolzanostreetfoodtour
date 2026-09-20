import { describe, expect, it } from "vitest";
import { formatPostMonth, pickMorePosts } from "@/lib/content/blog";

const posts = ["a", "b", "c", "d", "e"].map((id) => ({ id }));

describe("pickMorePosts", () => {
  it("excludes the current post and keeps the newest-first order", () => {
    expect(pickMorePosts(posts[1], posts, 3).map((p) => p.id)).toEqual(["a", "c", "d"]);
  });

  it("caps the result at max", () => {
    expect(pickMorePosts(posts[0], posts, 2)).toHaveLength(2);
  });

  it("returns an empty list when the current post is the only one", () => {
    expect(pickMorePosts(posts[0], [posts[0]], 3)).toEqual([]);
  });
});

describe("formatPostMonth", () => {
  it("formats month and year", () => {
    expect(formatPostMonth(new Date("2020-10-15T12:00:00Z"))).toBe("October 2020");
  });

  it("uses UTC, so a month-boundary timestamp never shifts month", () => {
    expect(formatPostMonth(new Date("2020-11-01T00:30:00Z"))).toBe("November 2020");
  });
});
