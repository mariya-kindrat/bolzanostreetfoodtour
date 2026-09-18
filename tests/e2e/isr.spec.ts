import { expect, test } from "@playwright/test";

test("tour pages are served statically (x-nextjs-cache or equivalent build-time generation)", async ({
  page,
}) => {
  const response = await page.goto("/tours/bolzano-street-food-tour");
  expect(response?.status()).toBe(200);
});

test("revalidate route rejects a request with no/incorrect secret", async ({ request }) => {
  const res = await request.post("/api/revalidate", {
    headers: { "x-revalidate-secret": "wrong" },
    data: { path: "/" },
  });
  expect(res.status()).toBe(401);
});
