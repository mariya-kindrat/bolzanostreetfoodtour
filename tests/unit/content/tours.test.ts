import { describe, expect, it } from "vitest";
import { pickOnePerCategory, pickRelatedTours, type TourWithTiers } from "@/lib/content/tours";

function tour(id: string, categoryId: string, sortOrder: number): TourWithTiers {
  return { id, categoryId, category: { id: categoryId, sortOrder } } as unknown as TourWithTiers;
}

describe("pickOnePerCategory", () => {
  it("keeps only the first tour of each category", () => {
    const picked = pickOnePerCategory(
      [tour("a1", "a", 1), tour("a2", "a", 1), tour("b1", "b", 2)],
      4,
    );
    expect(picked.map((t) => t.id)).toEqual(["a1", "b1"]);
  });

  it("orders by category sortOrder, not input order", () => {
    const picked = pickOnePerCategory([tour("b1", "b", 2), tour("a1", "a", 1)], 4);
    expect(picked.map((t) => t.id)).toEqual(["a1", "b1"]);
  });

  it("caps the result at max", () => {
    const tours = [tour("a", "a", 1), tour("b", "b", 2), tour("c", "c", 3)];
    expect(pickOnePerCategory(tours, 2)).toHaveLength(2);
  });

  it("returns an empty list when there are no tours", () => {
    expect(pickOnePerCategory([], 4)).toEqual([]);
  });
});

describe("pickRelatedTours", () => {
  const all = [
    tour("a1", "a", 1),
    tour("a2", "a", 1),
    tour("b1", "b", 2),
    tour("c1", "c", 3),
    tour("a3", "a", 1),
  ];

  it("excludes the current tour", () => {
    const picked = pickRelatedTours(all[0], all, 4);
    expect(picked.map((t) => t.id)).not.toContain("a1");
  });

  it("puts same-category tours first, then fills from other categories", () => {
    const picked = pickRelatedTours(all[0], all, 4);
    expect(picked.map((t) => t.id)).toEqual(["a2", "a3", "b1", "c1"]);
  });

  it("caps the result at max", () => {
    expect(pickRelatedTours(all[0], all, 3)).toHaveLength(3);
  });

  it("returns an empty list when the current tour is the only one", () => {
    expect(pickRelatedTours(all[0], [all[0]], 3)).toEqual([]);
  });
});
