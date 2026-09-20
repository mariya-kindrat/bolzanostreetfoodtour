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

test("'Discover our tours' wraps to the live cards as soon as a slide lands on the copies", async ({
  page,
}) => {
  await page.goto("/");
  const track = page.locator("#discover-our-tours ul");
  const { loop, distance } = await track.evaluate((el) => {
    const items = el.children as HTMLCollectionOf<HTMLElement>;
    const loop = items[items.length / 2].offsetLeft - items[0].offsetLeft;
    const card = loop / (items.length / 2);
    return { loop, distance: Math.max(1, Math.round(el.clientWidth / card)) * card };
  });
  await page.locator("#discover-our-tours").hover();
  await page.waitForTimeout(1700);
  await track.evaluate((el, at) => (el.scrollLeft = at), loop - distance);
  await page.getByRole("button", { name: "Next tours" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 4000 }).toBeLessThan(loop / 2);
});

test("'Discover our tours' keeps auto-advancing after a mouse click on an arrow", async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, "hover and mouse-click behaviour");
  await page.goto("/");
  const track = page.locator("#discover-our-tours ul");
  await page.getByRole("button", { name: "Next tours" }).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1700);
  const afterClick = await track.evaluate((el) => el.scrollLeft);
  await expect
    .poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 9000 })
    .not.toBe(afterClick);
});

test("'Discover our tours' does not keep auto-advancing while the pointer rests on it", async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, "hover behaviour");
  await page.goto("/");
  const track = page.locator("#discover-our-tours ul");
  const position = () => track.evaluate((el) => el.scrollLeft);
  await expect.poll(position, { timeout: 8000 }).toBeGreaterThan(20);
  await track.hover();
  await page.waitForTimeout(2000);
  const settled = await position();
  await page.waitForTimeout(5000);
  expect(await position()).toBe(settled);
});

test("why section shows the five senses and both photos", async ({ page }) => {
  await page.goto("/");
  const section = page.getByTestId("why-section");
  await expect(section.getByRole("list", { name: "The five senses" }).getByRole("listitem")).toHaveCount(5);
  await expect(section.getByRole("img")).toHaveCount(2);
});

test("gateway section pairs the Italian and German market photos with a seam badge", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.getByTestId("gateway-section");
  await expect(section.getByRole("img")).toHaveCount(2);
  await expect(section.getByText("Parmigiano Reggiano")).toBeVisible();
  await expect(section.getByText("Südtiroler Speck")).toBeVisible();
  await expect(section.getByText("Italiano")).toBeVisible();
  await expect(section.getByText("Deutsch")).toBeVisible();
});

test("where section lists the compass neighbours and links to private transfers", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.getByTestId("where-section");
  for (const place of ["Austria", "Trentino", "Dolomites"]) {
    await expect(section.getByRole("listitem").filter({ hasText: place })).toHaveCount(1);
  }
  await expect(section.getByRole("link", { name: /See private transfers/ })).toHaveAttribute(
    "href",
    "/private-transfers",
  );
});

test("trust block shows five passport stamps with their sentences", async ({ page }) => {
  await page.goto("/");
  const block = page.getByTestId("trust-block");
  await expect(block.getByRole("listitem")).toHaveCount(5);
  await expect(block.getByText("No. 1", { exact: true })).toBeVisible();
  await expect(block.getByText("2–12", { exact: true })).toBeVisible();
  await expect(block.getByText(/Guaranteed Departures with min 2/)).toBeVisible();
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
