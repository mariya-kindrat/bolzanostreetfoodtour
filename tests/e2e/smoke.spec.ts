import { expect, test } from "@playwright/test";

const CATEGORY_NAMES = ["Street Food Tours", "Cooking Classes", "Wine Tours", "Winter Tours"];

test("home page renders", async ({ page }) => {
  await page.goto("/");
  // The brand name lives in the header wordmark, not the hero h1 — the h1
  // now rotates through category names (see HeroCategoryContent.tsx), so
  // it's checked separately against the known category set rather than a
  // fixed string.
  await expect(
    page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Bolzano Street Food Tour", exact: true }),
  ).toBeVisible();
  const heading = await page.getByRole("heading", { level: 1 }).textContent();
  expect(CATEGORY_NAMES).toContain(heading);
});
