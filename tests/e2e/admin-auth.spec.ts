import { expect, test } from "@playwright/test";

test("visiting /admin while logged out redirects to Clerk sign-in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/sign-in/);
});
