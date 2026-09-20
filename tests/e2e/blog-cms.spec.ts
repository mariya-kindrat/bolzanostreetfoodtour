import { config } from "dotenv";
import { Client } from "pg";
import { expect, test } from "@playwright/test";
import { BLOG_AUTHOR } from "../../lib/content/global";

config({ path: ".env.local" });

// Unique per worker so the desktop and mobile projects never collide on the slug or the
// tag (a shared tag page would be served from the other worker's ISR cache).
const SLUG = `e2e-cms-${Date.now()}-${process.pid}`;
const TITLE = `E2E Journal Post ${process.pid}`;
const TAG = `e2e-tag-${process.pid}`;
const TAG_LABEL = `e2e tag ${process.pid}`;
const IMAGE = "/images/home/mosaic/farmhouse-kitchen.jpg";
// Plain pg, not lib/db: Playwright loads specs as CommonJS, and the generated Prisma
// client uses import.meta, which fails there.
const client = new Client({ connectionString: process.env.DATABASE_URL });

let connected = false;

test.beforeAll(async () => {
  await client.connect();
  connected = true;
  await client.query(
    `INSERT INTO "BlogPost" (id, slug, title, excerpt, content, "coverImageUrl", "coverImageAlt", tags, "publishedAt", "updatedAt")
     VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, now())`,
    [
      SLUG,
      TITLE,
      "A short excerpt for the card.",
      `## A heading\n\nFirst paragraph with **bold** text.\n\n![Farmhouse kitchen](${IMAGE})`,
      IMAGE,
      "A farmhouse kitchen",
      [TAG],
      new Date("2020-01-15T12:00:00Z"),
    ],
  );
});

test.afterAll(async () => {
  if (connected) await client.query(`DELETE FROM "BlogPost" WHERE id = $1`, [SLUG]);
  await client.end();
});

test("a post renders its cover, byline, reading time, tags and Markdown body", async ({ page }) => {
  await page.goto(`/blog/${SLUG}`);
  await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();
  await expect(page.getByText(`By ${BLOG_AUTHOR}`)).toBeVisible();
  await expect(page.getByText(/\d+ min read/)).toBeVisible();
  await expect(page.getByRole("link", { name: TAG_LABEL })).toHaveAttribute(
    "href",
    `/blog/tag/${TAG}`,
  );
  await expect(page.getByRole("heading", { level: 2, name: "A heading" })).toBeVisible();
  await expect(page.getByText("bold", { exact: true })).toBeVisible();
  // Exact names: "Farmhouse kitchen" (body) is a substring of "A farmhouse kitchen" (cover).
  await expect(page.getByRole("img", { name: "A farmhouse kitchen", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Farmhouse kitchen", exact: true })).toBeVisible();
});

test("the tag page lists the tagged post and the tag filter marks it active", async ({ page }) => {
  await page.goto(`/blog/tag/${TAG}`);
  await expect(page.getByRole("heading", { name: TITLE })).toBeVisible();
  await expect(page.getByRole("link", { name: "All", exact: true })).toHaveAttribute(
    "href",
    "/blog",
  );
  await expect(page.getByRole("link", { name: TAG_LABEL })).toHaveAttribute("aria-current", "page");
});

test("an unknown tag renders the not-found page", async ({ page }) => {
  const response = await page.goto("/blog/tag/no-such-tag-anywhere");
  expect(response?.status()).toBe(404);
});
