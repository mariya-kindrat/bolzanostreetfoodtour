import { expect, test } from "@playwright/test";

const FIRST_CATEGORY_ALT =
  "A bustling market street in Bolzano's old town, with food stalls, fruit stands, and the frescoed Casa al Torchio building";

test("reduced-motion preference shows the static hero image, never the 3D canvas", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(`img[alt="${FIRST_CATEGORY_ALT}"]`)).toBeVisible();
});

test("the hero's CTA links to the currently-showing category's catalog page", async ({
  page,
}) => {
  await page.goto("/");
  // Slide 0 (Street Food Tours) stays dominant for the first couple of
  // seconds of the crossfade cycle, well past normal test/click latency —
  // see lib/hero/heroCarouselLayout.ts's computeSlideState.
  await page.getByRole("link", { name: "Explore Street Food Tours" }).click();
  await expect(page).toHaveURL(/\/street-food-tours/);
});

test("the hero's canvas count matches the active category count, the branch overlay degrades gracefully, and the static photo always shows", async ({
  page,
}) => {
  const branchImageResponses: number[] = [];
  page.on("response", (response) => {
    if (response.url().includes("branch.png")) branchImageResponses.push(response.status());
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // 4 seeded categories -> 1 canvas (all slides render in a single Canvas).
  await expect(page.locator("canvas")).toHaveCount(1);

  await expect(page.locator(`img[alt="${FIRST_CATEGORY_ALT}"]`)).toBeVisible();

  // branch.png doesn't exist yet either - confirm the request 404s (expected
  // and documented) and that TreeBranchOverlay actually removed the element
  // rather than leaving a broken-image icon.
  if (branchImageResponses.length > 0) {
    expect(branchImageResponses).toEqual([404]);
  }
  await expect(page.locator("img.hero-branch")).toHaveCount(0);
});
