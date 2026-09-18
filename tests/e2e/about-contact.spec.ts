import { expect, test } from "@playwright/test";

test("about page renders real migrated copy", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("We are a group of food lovers")).toBeVisible();
});

test("contact form submission is captured", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill(`test-${Date.now()}@example.com`);
  await page.getByLabel("Message").fill("Test message from Playwright.");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Thanks — we'll be in touch soon.")).toBeVisible();
});
