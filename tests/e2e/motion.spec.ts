import { expect, test } from "@playwright/test";

test("reduced-motion preference disables scroll-reveal — content is visible immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const revealed = page.locator(".reveal").first();
  await expect(revealed).toHaveClass(/is-visible/);
});

test("scroll-reveal activates elements below the fold on scroll (no reduced-motion)", async ({
  page,
}) => {
  await page.goto("/");
  const belowFold = page.locator(".reveal").nth(3);
  await belowFold.scrollIntoViewIfNeeded();
  await expect(belowFold).toHaveClass(/is-visible/, { timeout: 2000 });
});
