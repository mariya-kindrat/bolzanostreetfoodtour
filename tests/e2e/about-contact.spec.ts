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

test("about page shows the story photo, sign-off and a link to the tours", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1, name: "About Us" })).toBeVisible();
  await expect(page.getByText("Buon Appetito! Mahlzeit! Happy Eating!")).toBeVisible();
  await page.getByRole("link", { name: /See our tours/ }).click();
  await expect(page).toHaveURL(/\/tours$/);
});

test("contact page offers tappable email and phone links and the meeting point directions", async ({
  page,
}) => {
  await page.goto("/contact");
  const details = page.getByRole("complementary", { name: "Contact details" });
  await expect(
    details.getByRole("link", { name: "info@bolzanostreetfoodtour.com" }),
  ).toHaveAttribute("href", "mailto:info@bolzanostreetfoodtour.com");
  await expect(details.getByRole("link", { name: "+39 366 227 6538" })).toHaveAttribute(
    "href",
    "tel:+393662276538",
  );
  await expect(details.getByRole("link", { name: "(800) 771-7756" })).toHaveAttribute(
    "href",
    "tel:+18007717756",
  );
  await expect(page.getByRole("heading", { name: "Meeting point directions" })).toBeVisible();
});
