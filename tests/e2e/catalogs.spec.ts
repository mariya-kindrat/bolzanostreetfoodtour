import { expect, test } from "@playwright/test";

test("cooking classes catalog lists all 3 real products with working links", async ({ page }) => {
  await page.goto("/cooking-classes");
  const links = page.getByRole("link", { name: "More details" });
  await expect(links).toHaveCount(3);
});

test("wine tours catalog lists all 6 real products, including the Tramin placeholder", async ({
  page,
}) => {
  await page.goto("/wine-tours");
  await expect(page.getByRole("heading", { name: /Tramin/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "More details" })).toHaveCount(6);
});

test("winter tours catalog lists all 9 products linking to their own detail pages", async ({
  page,
}) => {
  await page.goto("/winter-tours");
  const links = page.getByRole("link", { name: "More details" });
  await expect(links).toHaveCount(9);
  // Quote-only messaging lives on the detail page, not the catalog card.
  for (const href of await links.evaluateAll((els) =>
    els.map((el) => el.getAttribute("href") ?? ""),
  )) {
    expect(href).toMatch(/^\/tours\//);
  }
});
