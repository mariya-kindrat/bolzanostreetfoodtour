import { describe, expect, it } from "vitest";
import { validateCategoryBody } from "@/lib/admin/categoryValidation";

const VALID_BODY = {
  slug: "wine-tours",
  name: "Wine Tours",
  description: "Vineyard visits and tastings.",
  photoUrl: "/images/tours/wine-tour-hero.jpg",
  altText: "Grapes in a vineyard row",
};

describe("validateCategoryBody", () => {
  it("accepts a fully-populated body and defaults sortOrder/isActive/isBookable", () => {
    expect(validateCategoryBody(VALID_BODY)).toEqual({
      fields: { ...VALID_BODY, sortOrder: 0, isActive: true, isBookable: true },
    });
  });

  it("keeps explicit sortOrder/isActive/isBookable values", () => {
    const result = validateCategoryBody({
      ...VALID_BODY,
      sortOrder: 3,
      isActive: false,
      isBookable: false,
    });
    expect(result).toEqual({
      fields: { ...VALID_BODY, sortOrder: 3, isActive: false, isBookable: false },
    });
  });

  it.each(["slug", "name", "description", "photoUrl", "altText"] as const)(
    "returns an error when %s is missing",
    (field) => {
      const body = { ...VALID_BODY, [field]: undefined };
      expect(validateCategoryBody(body)).toHaveProperty("error");
    },
  );

  it("returns an error when a required field is an empty string", () => {
    expect(validateCategoryBody({ ...VALID_BODY, name: "" })).toHaveProperty("error");
  });

  it.each(["About", "wine tours", "wine/tours", "-wine", "wine--tours", "wine_tours"])(
    "rejects the malformed slug %j",
    (slug) => {
      expect(validateCategoryBody({ ...VALID_BODY, slug })).toHaveProperty("error");
    },
  );

  it.each(["about", "tours", "categories", "admin", "api", "blog"])(
    "rejects the reserved slug %j",
    (slug) => {
      const result = validateCategoryBody({ ...VALID_BODY, slug });
      expect(result).toHaveProperty("error");
      expect((result as { error: string }).error).toContain("reserved");
    },
  );

  it.each(["https://example.com/x.jpg", "//example.com/x.jpg", "images/x.jpg"])(
    "rejects the non-local photo URL %j",
    (photoUrl) => {
      expect(validateCategoryBody({ ...VALID_BODY, photoUrl })).toHaveProperty("error");
    },
  );

  it("falls back a non-numeric sortOrder to 0 instead of writing NaN", () => {
    // A direct API call (bypassing CategoryForm's <input type="number">)
    // could send anything through JSON — this must never reach Prisma as
    // NaN, which would fail the Int column with a less friendly error.
    const result = validateCategoryBody({
      ...VALID_BODY,
      sortOrder: "not a number" as unknown as number,
    });
    expect(result).toMatchObject({ fields: { sortOrder: 0 } });
  });
});
