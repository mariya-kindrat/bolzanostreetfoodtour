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
