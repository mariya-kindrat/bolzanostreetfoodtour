import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/sentry-test/route";

describe("GET /api/sentry-test", () => {
  it("throws a deliberate error for Sentry verification", async () => {
    await expect(GET()).rejects.toThrow("Sentry test error from /api/sentry-test");
  });
});
