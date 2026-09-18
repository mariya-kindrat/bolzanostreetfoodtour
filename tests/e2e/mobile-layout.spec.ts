import { expect, test, type Page } from "@playwright/test";

const VIEWPORT_WIDTH = 390;

const ROUTES = [
  "/",
  "/cooking-classes",
  "/wine-tours",
  "/winter-tours",
  "/private-transfers",
  "/about",
  "/contact",
  "/blog",
  "/tours/bolzano-street-food-tour",
  "/legal/privacy-policy",
];

/* `document.documentElement.scrollWidth` is useless as an overflow signal here:
   globals.css sets `overflow-x: hidden` on html/body, which clips the scroll
   area to the viewport so scrollWidth reads 390 no matter how far content
   actually extends. Measuring each element's own right edge is unaffected by
   any ancestor's overflow clipping, so it sees content that is really pushed
   off-screen (and therefore unreachable on a phone).

   Content inside a deliberately side-scrollable container (the wide rate
   tables) is excluded: it is reachable by scrolling that container, which is
   the point of the wrapper. */
async function widestRightEdge(page: Page): Promise<number> {
  return page.evaluate(() => {
    const insideScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (["auto", "scroll"].includes(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    return Math.max(
      ...Array.from(document.querySelectorAll("body *"))
        .filter((el) => !insideScroller(el))
        .map((el) => el.getBoundingClientRect().right),
    );
  });
}

for (const route of ROUTES) {
  test(`${route} has no horizontal overflow at ${VIEWPORT_WIDTH}px width`, async ({ page }) => {
    await page.setViewportSize({ width: VIEWPORT_WIDTH, height: 844 });
    await page.goto(route);
    const rightEdge = await widestRightEdge(page);
    expect(
      rightEdge,
      `${route} overflows at ${VIEWPORT_WIDTH}px (widest right edge=${rightEdge})`,
    ).toBeLessThanOrEqual(VIEWPORT_WIDTH);
  });
}

test(`primary nav collapses behind a Menu button at ${VIEWPORT_WIDTH}px`, async ({ page }) => {
  await page.setViewportSize({ width: VIEWPORT_WIDTH, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Blog", exact: true })).toBeHidden();

  // The centered brand mark is the home link (no separate "Home" nav item,
  // matching the header's three-zone left-nav/brand/right-nav layout) — it
  // must stay reachable on mobile even before the disclosure menu opens.
  const brandLink = nav.getByRole("link", { name: "Bolzano Street Food Tour" });
  await expect(brandLink).toBeVisible();
  const brandBox = await brandLink.boundingBox();
  expect(brandBox!.x + brandBox!.width).toBeLessThanOrEqual(VIEWPORT_WIDTH);

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  for (const label of ["Transfers", "About", "Blog", "Contact"]) {
    const link = nav.getByRole("link", { name: label, exact: true });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(VIEWPORT_WIDTH);
  }
});
