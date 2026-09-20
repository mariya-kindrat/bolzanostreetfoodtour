import { expect, test } from "@playwright/test";

test("flagship tour detail page renders seeded content and a coming-soon booking slot", async ({
  page,
}) => {
  await page.goto("/tours/bolzano-street-food-tour");
  await expect(
    page.getByRole("heading", { name: "Bolzano Street Food Tour®", level: 1 }),
  ).toBeVisible();
  // The price line renders both in the hero (a <p>) and the booking widget
  // (an <h3>) by design — scope to the widget's heading to avoid a
  // Playwright strict-mode "multiple elements" match on plain getByText.
  await expect(page.getByRole("heading", { name: "€109.00 / person", level: 3 })).toBeVisible();
  await expect(page.getByText("Online booking is coming soon.")).toBeVisible();
  await expect(page.getByText("If you cancel at least 7 day(s)")).toBeVisible();
});

test("cooking class detail page renders 'From' pricing", async ({ page }) => {
  await page.goto("/tours/farmhouse-private-cooking-class");
  await expect(
    page.getByRole("heading", { name: "From €203.00 / person", level: 3 }),
  ).toBeVisible();
});

test("winter tour detail page shows a quote-only notice, no cancellation policy", async ({
  page,
}) => {
  await page.goto("/tours/eastern-dolomites-christmas-markets");
  await expect(page.getByText("This is a custom, quote-only excursion.")).toBeVisible();
  await expect(page.getByText("If you cancel at least 7 day(s)")).toHaveCount(0);
});

test("unknown tour slug renders the not-found page", async ({ page }) => {
  const response = await page.goto("/tours/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Tour not found" })).toBeVisible();
});

test("tour detail lists related tours and links to a prefilled contact form", async ({ page }) => {
  await page.goto("/tours/bolzano-street-food-tour");
  await expect(page.getByRole("heading", { name: "More tours to explore" })).toBeVisible();
  await page
    .getByRole("complementary", { name: "Booking" })
    .getByRole("link", { name: "Contact us" })
    .click();
  await expect(page.getByLabel("Subject")).toHaveValue("Inquiry: Bolzano Street Food Tour®");
});

test("quote-only tour offers a quote request", async ({ page }) => {
  await page.goto("/tours/eastern-dolomites-christmas-markets");
  await expect(
    page
      .getByRole("complementary", { name: "Booking" })
      .getByRole("link", { name: "Request a quote" }),
  ).toBeVisible();
});
