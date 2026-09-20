import { describe, expect, it } from "vitest";
import {
  NAV_ITEMS,
  TRUST_POINTS,
  CONTACT_INFO,
  telHref,
  withCategoryLinks,
} from "@/lib/content/global";
import type { Category } from "@/lib/generated/prisma/client";

function category(overrides: Partial<Category>): Category {
  return {
    id: "id",
    slug: "slug",
    name: "Name",
    description: "d",
    photoUrl: "/p.jpg",
    altText: "alt",
    sortOrder: 0,
    isActive: true,
    isBookable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("global content", () => {
  it("has one nav item per real top-level product/page, no dead links", () => {
    expect(NAV_ITEMS.every((item) => item.href !== "#" && item.href !== "")).toBe(true);
  });

  it("has exactly 5 trust points, each with a stamp label and a sentence", () => {
    expect(TRUST_POINTS).toHaveLength(5);
    for (const point of TRUST_POINTS) {
      expect(point.stamp).toBeTruthy();
      expect(point.text).toBeTruthy();
    }
  });

  it("has a real contact email and both phone numbers", () => {
    expect(CONTACT_INFO.email).toBe("info@bolzanostreetfoodtour.com");
    expect(CONTACT_INFO.phoneItaly).toBeTruthy();
    expect(CONTACT_INFO.phoneUsTollFree).toBeTruthy();
  });
});

describe("withCategoryLinks", () => {
  it("sets the Tours item's children to every given category, in order", () => {
    const categories = [
      category({ slug: "street-food-tours", name: "Street Food Tours" }),
      category({ slug: "wine-tours", name: "Wine Tours" }),
    ];
    const tours = withCategoryLinks(NAV_ITEMS, categories).find((i) => i.label === "Tours");
    expect(tours?.children).toEqual([
      { label: "Street Food Tours", href: "/street-food-tours" },
      { label: "Wine Tours", href: "/wine-tours" },
    ]);
  });

  it("links the Tours item itself to the all-categories page", () => {
    const tours = NAV_ITEMS.find((item) => item.label === "Tours");
    expect(tours?.href).toBe("/categories");
  });

  it("leaves every other nav item untouched", () => {
    const result = withCategoryLinks(NAV_ITEMS, [category({ slug: "wine-tours" })]);
    const nonTours = result.filter((item) => item.label !== "Tours");
    const originalNonTours = NAV_ITEMS.filter((item) => item.label !== "Tours");
    expect(nonTours).toEqual(originalNonTours);
  });

  it("does not mutate the original NAV_ITEMS array", () => {
    const before = JSON.parse(JSON.stringify(NAV_ITEMS));
    withCategoryLinks(NAV_ITEMS, [category({ slug: "wine-tours" })]);
    expect(NAV_ITEMS).toEqual(before);
  });
});

describe("telHref", () => {
  it("keeps a leading plus and strips formatting", () => {
    expect(telHref("+39 366 227 6538")).toBe("tel:+393662276538");
  });

  it("prefixes the country code when the number has none", () => {
    expect(telHref("(800) 771-7756", "+1")).toBe("tel:+18007717756");
  });
});
