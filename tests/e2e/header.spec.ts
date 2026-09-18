import { expect, test } from "@playwright/test";

test("hovering Tours opens a dropdown of category links, and Tours itself is a link", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "hover dropdown is desktop-nav only; mobile lists categories inline");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const tours = nav.getByRole("link", { name: "Tours", exact: true });

  await expect(nav.getByRole("link", { name: "Wine Tours" })).toBeHidden();
  await tours.hover();
  await expect(nav.getByRole("link", { name: "Wine Tours" })).toBeVisible();

  await page.mouse.move(10, 10);
  await expect(nav.getByRole("link", { name: "Wine Tours" })).toBeHidden();

  await tours.hover();
  await nav.getByRole("link", { name: "Wine Tours" }).click();
  await expect(page).toHaveURL(/\/wine-tours$/);
});

test("keyboard focus on Tours opens the dropdown", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover/focus dropdown is desktop-nav only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Tours", exact: true }).focus();
  await expect(nav.getByRole("link", { name: "Wine Tours" })).toBeVisible();
});

test("the mobile Menu lists categories under Tours", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile Menu only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Wine Tours" })).toBeVisible();
});

test("the 'Book a tour' CTA stays visible on mobile without opening the Menu", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "this checks the mobile-only always-visible CTA");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Book a tour" })).toBeVisible();
});

test("the header tints and blurs on scroll, and resets back at the top", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");

  const atTop = await header.evaluate((el) => getComputedStyle(el).backgroundColor);

  // window.scrollTo, not page.mouse.wheel: wheel-event scroll distance is
  // emulation-dependent (flaky specifically on the mobile/touch device
  // profile) — a direct scroll position is deterministic on every device.
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect
    .poll(async () => header.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(atTop);
  await expect
    .poll(async () => header.evaluate((el) => getComputedStyle(el).backdropFilter))
    .not.toBe("none");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect
    .poll(async () => header.evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe(atTop);
});

test("Tours goes to the all-categories page, and 'Book a tour' goes to the all-tours page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Book a tour" }).click();
  await expect(page).toHaveURL(/\/tours$/);
  await expect(page.getByRole("heading", { level: 1, name: "Our tours" })).toBeVisible();

  test.skip(isMobile, "the Tours label link is in the desktop nav");
  await nav.getByRole("link", { name: "Tours", exact: true }).click();
  await expect(page).toHaveURL(/\/categories$/);
  await expect(page.getByRole("heading", { level: 1, name: "Our categories" })).toBeVisible();
});
