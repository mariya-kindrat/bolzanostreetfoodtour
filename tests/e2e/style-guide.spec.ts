import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("style guide renders the expanded token set", async ({ page }) => {
  await page.goto("/style-guide");
  await expect(page.getByRole("heading", { name: "Type scale", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shape & shadow", level: 2 })).toBeVisible();
});

test("style guide renders every design-system token and component", async ({ page }) => {
  await page.goto("/style-guide");
  await expect(page.getByRole("heading", { name: "Colors", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Typography", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Buttons", level: 2 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Primary button" })).toBeVisible();
});

test("style guide has no WCAG 2.1 AA violations (incl. color contrast)", async ({ page }) => {
  await page.goto("/style-guide");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("secondary button has a solid, non-transparent background (WCAG contrast fix)", async ({
  page,
}) => {
  await page.goto("/style-guide");
  const secondary = page.getByRole("link", { name: "Secondary button" });
  const bg = await secondary.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  expect(bg).not.toBe("transparent");
});

test("primary button shows a visible hover state", async ({ page }) => {
  await page.goto("/style-guide");
  const primary = page.getByRole("link", { name: "Primary button" });
  const before = await primary.evaluate((el) => getComputedStyle(el).transform);
  await primary.hover();
  const after = await primary.evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
});

test("style guide renders a label chip with its notched shape applied", async ({ page }) => {
  await page.goto("/style-guide");
  await expect(page.getByRole("heading", { name: "Label chip", level: 2 })).toBeVisible();
  await expect(page.getByText("No. 01")).toBeVisible();
  const chip = page.getByText("No. 01").locator("..");
  const clipPath = await chip.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clipPath).not.toBe("none");
});

test("style guide renders a bottom-left label chip variant", async ({ page }) => {
  await page.goto("/style-guide");
  await expect(page.getByText("No. 02")).toBeVisible();
  await expect(page.getByText("Caldaro")).toBeVisible();
});

test("style guide renders an Input section", async ({ page }) => {
  await page.goto("/style-guide");
  await expect(page.getByRole("heading", { name: "Input", level: 2 })).toBeVisible();
  await expect(page.getByLabel("Example input")).toBeVisible();
});

test("kicker renders with uppercase, letter-spaced styling", async ({ page }) => {
  await page.goto("/style-guide");
  const kicker = page.getByText("Bozen · Bolzano — Altstadt");
  await expect(kicker).toBeVisible();
  const style = await kicker.evaluate((el) => getComputedStyle(el).textTransform);
  expect(style).toBe("uppercase");
});

test("a heading has real space before its following paragraph (vertical rhythm)", async ({
  page,
}) => {
  await page.goto("/style-guide");
  // "Heading level 3" is immediately followed in the DOM by the Text
  // paragraph with nothing else between them — isolates the margin the fix
  // adds. (Heading level 2 is NOT adjacent to the paragraph: Heading level 3
  // sits between them, so that pair's "gap" would already exceed 8px from
  // Heading level 3's own rendered height alone, passing even before any
  // margin fix — the wrong red/green signal.)
  const heading = page.getByRole("heading", { name: "Heading level 3" });
  const paragraph = page.getByText("Body text in", { exact: false });
  const headingBox = await heading.boundingBox();
  const paraBox = await paragraph.boundingBox();
  const gap = paraBox!.y - (headingBox!.y + headingBox!.height);
  expect(gap).toBeGreaterThan(8);
});

test("style guide renders a real Section tone=\"forest-dark\"", async ({ page }) => {
  await page.goto("/style-guide");
  const demo = page.getByTestId("forest-dark-section-demo");
  await expect(demo).toBeVisible();
  const section = page.locator("section").filter({ has: demo });
  const bg = await section.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(20, 38, 27)"); // --color-forest-dark, from Section tone="forest-dark" itself
});
