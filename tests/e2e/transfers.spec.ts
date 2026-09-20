import { expect, test } from "@playwright/test";

// Mobile overflow for /private-transfers is covered by mobile-layout.spec.ts's
// route list, which measures real (unclipped) overflow.
test("transfers page renders all 7 rate rows and all 7 supplement rows", async ({ page }) => {
  await page.goto("/private-transfers");
  await expect(page.locator("table").first().locator("tbody tr")).toHaveCount(7);
  await expect(page.locator("table").nth(1).locator("tbody tr")).toHaveCount(7);
});

test("transfers page shows the key facts strip and the tour-clients-only notice", async ({
  page,
}) => {
  await page.goto("/private-transfers");
  await expect(page.getByText("Up to 7, with luggage")).toBeVisible();
  await expect(page.getByText("At least 72 hours")).toBeVisible();
  await expect(
    page.getByText("strictly reserved to Bolzano Street Food Tours clients"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Airport transfers — what to expect" }),
  ).toBeVisible();
});
