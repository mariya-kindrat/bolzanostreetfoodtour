import { describe, expect, it } from "vitest";
import { PHOTO_CREDITS } from "@/lib/content/photo-credits";

describe("photo credits content", () => {
  it("has exactly 10 credited images", () => {
    expect(PHOTO_CREDITS).toHaveLength(10);
  });

  it("has non-empty attribution fields for every image", () => {
    for (const credit of PHOTO_CREDITS) {
      expect(credit.filename).toBeTruthy();
      expect(credit.commonsTitle).toBeTruthy();
      expect(credit.author).toBeTruthy();
      expect(credit.license).toBeTruthy();
      expect(credit.licenseUrl).toBeTruthy();
      expect(credit.sourceUrl).toBeTruthy();
    }
  });

  it("links each image's license and source to a real URL", () => {
    for (const credit of PHOTO_CREDITS) {
      expect(credit.licenseUrl).toMatch(/^https:\/\//);
      expect(credit.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });
});
