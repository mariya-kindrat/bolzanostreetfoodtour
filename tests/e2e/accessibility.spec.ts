import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/cooking-classes",
  "/wine-tours",
  "/winter-tours",
  "/private-transfers",
  "/about",
  "/contact",
  "/blog",
  "/blog/thanksgiving-south-tyrol-style",
  "/tours/bolzano-street-food-tour",
  "/tours/farmhouse-private-cooking-class",
  "/tours/south-tyrol-wine-road-tour-full-day",
  "/tours/eastern-dolomites-christmas-markets",
  "/legal/privacy-policy",
  "/legal/terms-and-booking-conditions",
];

for (const route of ROUTES) {
  test(`${route} has no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
