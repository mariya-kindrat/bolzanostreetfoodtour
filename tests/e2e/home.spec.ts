import { expect, test } from "@playwright/test";

test("home page 'Discover our tours' carousel links every card to a real tour page", async ({
  page,
}) => {
  await page.goto("/");
  const links = page.locator("#discover-our-tours a");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    expect(await links.nth(i).getAttribute("href")).toMatch(/^\/tours\/[a-z0-9-]+$/);
  }
});

test("'Discover our tours' next arrow scrolls the carousel", async ({ page }) => {
  await page.goto("/");
  const track = page.locator("#discover-our-tours ul");
  await page.getByRole("button", { name: "Next tours" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});

test("'Discover our tours' slides a page forward after resting, and wraps to the start", async ({
  page,
}) => {
  await page.goto("/");
  const track = page.locator("#discover-our-tours ul");
  const loop = await track.evaluate((el) => {
    const items = el.children as HTMLCollectionOf<HTMLElement>;
    return items[items.length / 2].offsetLeft - items[0].offsetLeft;
  });
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 8000 }).toBeGreaterThan(50);

  await page.locator("#discover-our-tours").hover();
  await page.waitForTimeout(1700);
  await track.evaluate((el, at) => (el.scrollLeft = at), loop - 5);
  const next = page.getByRole("button", { name: "Next tours" });
  await next.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(loop);
  await page.waitForTimeout(1700);
  await next.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(loop / 2);
});

test("why section shows the five senses and both photos", async ({ page }) => {
  await page.goto("/");
  const section = page.getByTestId("why-section");
  await expect(section.getByRole("list", { name: "The five senses" }).getByRole("listitem")).toHaveCount(5);
  await expect(section.getByRole("img")).toHaveCount(2);
});

test("wine tours are introduced by a sand-toned feature with place badges and a link", async ({
  page,
}) => {
  await page.goto("/");
  const panel = page.getByTestId("wine-accent-panel");
  await expect(panel).toBeVisible();
  const section = page.locator("section").filter({ has: panel });
  const bg = await section.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(237, 230, 214)"); // --color-cream-dark, from Section tone="sand"
  await expect(panel.getByText("Kaltern", { exact: true })).toBeVisible();
  await expect(panel.getByText("Tramin", { exact: true })).toBeVisible();
  await expect(panel.getByRole("link", { name: /Explore wine tours/ })).toHaveAttribute(
    "href",
    "/wine-tours",
  );
});

test("newsletter signup captures an email", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Join our newsletter").fill(`test-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByText("Thanks — you're signed up.")).toBeVisible();
});
