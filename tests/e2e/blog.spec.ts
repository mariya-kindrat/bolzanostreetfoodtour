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
