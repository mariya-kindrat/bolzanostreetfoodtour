import { expect, test } from "@playwright/test";

test("sitemap.xml lists the home page and every real tour route", async ({ page }) => {
  const response = await page.goto("/sitemap.xml");
  const body = await response?.text();
  expect(body).toContain("<loc>");
  expect(body).toContain("/tours/bolzano-street-food-tour");
  expect(body).toContain("/blog/thanksgiving-south-tyrol-style");
});

test("robots.txt disallows /admin and /style-guide and references the sitemap", async ({
  page,
}) => {
  const response = await page.goto("/robots.txt");
  const body = await response?.text();
  expect(body).toContain("Disallow: /admin");
  expect(body).toContain("Disallow: /style-guide");
  expect(body).toContain("Sitemap:");
});

test("a tour page has a unique title and TouristTrip structured data", async ({ page }) => {
  await page.goto("/tours/bolzano-street-food-tour");
  await expect(page).toHaveTitle(/Bolzano Street Food Tour/);
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(jsonLd ?? "{}")["@type"]).toBe("TouristTrip");
});
