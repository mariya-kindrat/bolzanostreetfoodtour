import { describe, expect, it } from "vitest";
import { getAllTourSlugs, getTourBySlug, getToursByCategoryId } from "@/lib/content/tours";
import {
  getActiveCategories,
  getAllCategoriesForAdmin,
  getCategoryById,
  getCategoryBySlug,
} from "@/lib/content/categories";
import { getTransferRoutes } from "@/lib/content/transfers";
import { getPublishedBlogPosts } from "@/lib/content/blog";

describe("seeded content", () => {
  it("has 21 active tour slugs", async () => {
    expect(await getAllTourSlugs()).toHaveLength(21);
  });

  it("returns the flagship tour by slug with its price tiers", async () => {
    const tour = await getTourBySlug("bolzano-street-food-tour");
    expect(tour?.title).toBe("Bolzano Street Food Tour®");
    expect(tour?.priceTiers).toHaveLength(2);
  });

  it("has 4 active categories, winter-tours the only non-bookable one", async () => {
    const categories = await getActiveCategories();
    expect(categories).toHaveLength(4);
    const winterTours = categories.find((c) => c.slug === "winter-tours");
    expect(winterTours?.isBookable).toBe(false);
    expect(categories.filter((c) => c.isBookable)).toHaveLength(3);
  });

  it("admin category lookups (by id, and the full unfiltered list) work", async () => {
    const winterTours = await getCategoryBySlug("winter-tours");
    const byId = await getCategoryById(winterTours!.id);
    expect(byId?.slug).toBe("winter-tours");

    const all = await getAllCategoriesForAdmin();
    expect(all).toHaveLength(4);
  });

  it("groups tours by category", async () => {
    async function countFor(slug: string) {
      const category = await getCategoryBySlug(slug);
      return getToursByCategoryId(category!.id).then((tours) => tours.length);
    }
    expect(await countFor("winter-tours")).toBe(9);
    expect(await countFor("wine-tours")).toBe(6);
    expect(await countFor("cooking-classes")).toBe(3);
    expect(await countFor("street-food-tours")).toBe(3);
  });

  it("has 7 transfer routes each with supplements", async () => {
    const routes = await getTransferRoutes();
    expect(routes).toHaveLength(7);
    expect(routes[0].supplements).toHaveLength(7);
  });

  it("has 8 published blog posts", async () => {
    expect(await getPublishedBlogPosts()).toHaveLength(8);
  });
});
