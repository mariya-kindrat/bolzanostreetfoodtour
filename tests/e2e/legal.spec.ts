import { expect, test } from "@playwright/test";

test("both legal pages are reachable from the footer", async ({ page }) => {
  const footer = page.getByRole("contentinfo");
  await page.goto("/");
  await footer.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page).toHaveURL(/\/legal\/privacy-policy/);
  await expect(page.getByRole("heading", { name: "Data processors we use" })).toBeVisible();

  await page.goto("/");
  await footer.getByRole("link", { name: "Terms & Booking Conditions" }).click();
  await expect(page).toHaveURL(/\/legal\/terms-and-booking-conditions/);
});

test("privacy policy names Stripe, Clerk, Resend, and OpenRouter as data processors", async ({
  page,
}) => {
  await page.goto("/legal/privacy-policy");
  const body = await page.textContent("body");
  for (const processor of ["Stripe", "Clerk", "Resend", "OpenRouter"]) {
    expect(body).toContain(processor);
  }
});

test("footer offers tappable contact links, the legal pages and a back-to-top link", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: /info@bolzanostreetfoodtour\.com/ })).toHaveAttribute(
    "href",
    "mailto:info@bolzanostreetfoodtour.com",
  );
  await expect(footer.getByRole("link", { name: /Italy \+39/ })).toHaveAttribute(
    "href",
    "tel:+393662276538",
  );
  await expect(footer.getByRole("link", { name: /US toll-free/ })).toHaveAttribute(
    "href",
    "tel:+18007717756",
  );
  await expect(footer.getByRole("link", { name: "Photo Credits" })).toHaveAttribute(
    "href",
    "/photo-credits",
  );
  await expect(footer.getByRole("link", { name: "All tours" })).toHaveAttribute("href", "/categories");
  await expect(footer.getByRole("link", { name: /Back to top/ })).toBeVisible();
});

test("footer lists one tour per category with its price, and shows the social icons", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const cards = footer.locator('a[href^="/tours/"]');
  expect(await cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(4);
  await expect(cards.first()).toContainText(/€|Price on request|Contact us for pricing/);
  await expect(footer.getByTestId("footer-social").locator("li")).toHaveCount(3);
});
