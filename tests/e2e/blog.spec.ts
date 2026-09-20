import { expect, test } from "@playwright/test";

test("blog list renders all 8 migrated posts with their original publish dates", async ({
  page,
}) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { name: "Thanksgiving, South Tyrol style!" }),
  ).toBeVisible();
  await expect(page.getByText("October 2020")).toBeVisible();
  const postLinks = page.locator("article a");
  await expect(postLinks).toHaveCount(8);
});

test("a blog post page renders without layout breakage", async ({ page }) => {
  await page.goto("/blog/thanksgiving-south-tyrol-style");
  await expect(
    page.getByRole("heading", { name: "Thanksgiving, South Tyrol style!", level: 1 }),
  ).toBeVisible();
});

test("blog list leads with the newest post and each card is a single link to its story", async ({
  page,
}) => {
  await page.goto("/blog");
  const cards = page.locator("article");
  await expect(cards.first().getByRole("heading", { level: 2 })).toHaveText(
    "Thanksgiving, South Tyrol style!",
  );
  await expect(cards.first().getByRole("link")).toHaveAttribute(
    "href",
    "/blog/thanksgiving-south-tyrol-style",
  );
  for (const card of await cards.all()) await expect(card.getByRole("link")).toHaveCount(1);
});
