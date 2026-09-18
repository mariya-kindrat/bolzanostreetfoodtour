import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLocalBusinessJsonLd, buildTouristTripJsonLd } from "@/lib/seo/json-ld";

describe("buildTouristTripJsonLd", () => {
  it("includes the tour name and @type TouristTrip", () => {
    const jsonLd = buildTouristTripJsonLd({
      title: "Bolzano Street Food Tour®",
      description: "Taste the traditional food of Bolzano.",
      slug: "bolzano-street-food-tour",
    } as never);
    expect(jsonLd["@type"]).toBe("TouristTrip");
    expect(jsonLd.name).toBe("Bolzano Street Food Tour®");
    expect(jsonLd.url).toContain("/tours/bolzano-street-food-tour");
  });
});

describe("buildLocalBusinessJsonLd", () => {
  it("includes @type LocalBusiness and the real contact email", () => {
    const jsonLd = buildLocalBusinessJsonLd();
    expect(jsonLd["@type"]).toBe("LocalBusiness");
    expect(jsonLd.email).toBe("info@bolzanostreetfoodtour.com");
  });
});

describe("SITE_URL fallback", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = original;
    vi.resetModules();
  });

  it("falls back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();
    const { buildLocalBusinessJsonLd: build } = await import("@/lib/seo/json-ld");
    expect(build().url).toBe("http://localhost:3000");
  });
});
