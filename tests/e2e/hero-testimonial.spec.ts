import { expect, test } from "@playwright/test";

const activeQuote = (page: import("@playwright/test").Page) =>
  page
    .getByRole("figure", { name: "Guest testimonials" })
    .locator("blockquote:not([aria-hidden='true'])");

test("the hero shows one guest quote and it changes with the hero slide", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "the note is not shown on mobile");
  await page.goto("/");
  const first = await activeQuote(page).textContent();
  expect(first).toBeTruthy();

  await expect
    .poll(async () => activeQuote(page).textContent(), { timeout: 20_000 })
    .not.toBe(first);
});

test("under reduced motion the quote stays on the first testimonial", async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile, "the note is not shown on mobile");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(7000);
  await expect(activeQuote(page)).toContainText("Patricia R.");
  await context.close();
});

test("the note is not shown on mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop shows the note");
  await page.goto("/");
  await expect(page.getByRole("figure", { name: "Guest testimonials" })).toBeHidden();
});

test("the note scales with the window and never crosses the headline, badge or hero edges", async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile, "the note is desktop only");
  const sizes = [
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 1440, height: 600 },
  ];
  const fonts: number[] = [];

  for (const viewport of sizes) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/");
    const boxes = await page.evaluate(() => {
      const rect = (el: Element) => el.getBoundingClientRect();
      const note = document.querySelector("figure")!;
      const hero = note.parentElement!;
      const headline = document.querySelector("h1")!.parentElement!;
      const badge = hero.querySelector("svg[width=\"112\"]")!;
      const quote = note.querySelector("p")!;
      return {
        note: rect(note).toJSON(),
        hero: rect(hero).toJSON(),
        headline: rect(headline).toJSON(),
        badge: rect(badge).toJSON(),
        font: parseFloat(getComputedStyle(quote).fontSize),
      };
    });
    const { note, hero, headline, badge } = boxes;
    const label = `${viewport.width}x${viewport.height}`;

    expect(note.left, `${label}: clear of headline`).toBeGreaterThan(headline.right);
    expect(note.top, `${label}: below badge`).toBeGreaterThan(badge.bottom);
    expect(note.right, `${label}: inside hero`).toBeLessThanOrEqual(hero.right);
    expect(note.bottom, `${label}: inside hero`).toBeLessThanOrEqual(hero.bottom);
    // Proportional: the scroll image is 921x360 (0.39); it may only grow taller.
    expect(note.height / note.width, label).toBeGreaterThanOrEqual(0.38);
    expect(note.height / note.width, label).toBeLessThan(0.55);
    fonts.push(boxes.font);
    await context.close();
  }

  expect(fonts[0], "type is smaller on the smaller window").toBeLessThan(fonts[2]);
});

test("the note is hidden on short windows where it would hit the badge", async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile, "the note is desktop only");
  const context = await browser.newContext({ viewport: { width: 1440, height: 500 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("figure", { name: "Guest testimonials" })).toBeHidden();
  await context.close();
});

const unrollProgress = (page: import("@playwright/test").Page) =>
  page
    .getByRole("figure", { name: "Guest testimonials" })
    .locator("div")
    .first()
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--unroll").trim());

test("the scroll unrolls to fully open once it is on screen", async ({ page, isMobile }) => {
  test.skip(isMobile, "the note is not shown on mobile");
  await page.goto("/");
  await page.getByRole("figure", { name: "Guest testimonials" }).scrollIntoViewIfNeeded();
  await expect.poll(() => unrollProgress(page), { timeout: 10_000 }).toBe("1");
});

test("under reduced motion the scroll is open with no animation", async ({ browser, isMobile }) => {
  test.skip(isMobile, "the note is not shown on mobile");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  expect(await unrollProgress(page)).toBe("1");
  await context.close();
});
