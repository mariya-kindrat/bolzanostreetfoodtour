import { expect, test } from "@playwright/test";

test("home page has no dead tiles — every tile links to a real page", async ({ page }) => {
  await page.goto("/");
  const tiles = page.locator("#discover-our-tours a");
  const count = await tiles.count();
  expect(count).toBe(6);
  for (let i = 0; i < count; i++) {
    const href = await tiles.nth(i).getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toBe("#");
  }
});

test("wine tours are introduced by a dark cellar accent panel", async ({ page }) => {
  await page.goto("/");
  const panel = page.getByTestId("wine-accent-panel");
  await expect(panel).toBeVisible();
  const section = page.locator("section").filter({ has: panel });
  const bg = await section.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(20, 38, 27)"); // --color-forest-dark, from Section tone="forest-dark" itself
});

test("newsletter signup captures an email", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Join our newsletter").fill(`test-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByText("Thanks — you're signed up.")).toBeVisible();
});
