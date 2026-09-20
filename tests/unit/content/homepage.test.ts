import { describe, expect, it } from "vitest";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";

describe("homepage content", () => {
  it("has at least one testimonial with a real quote and author", () => {
    expect(HOMEPAGE_CONTENT.testimonials.length).toBeGreaterThan(0);
    for (const testimonial of HOMEPAGE_CONTENT.testimonials) {
      expect(testimonial.quote).toBeTruthy();
      expect(testimonial.author).toBeTruthy();
      expect(testimonial.origin).toBeTruthy();
      expect(testimonial.date).toBeTruthy();
    }
  });

  it("has non-empty heading/body copy for every content section", () => {
    expect(HOMEPAGE_CONTENT.heroTagline).toBeTruthy();
    expect(HOMEPAGE_CONTENT.toursIntro).toBeTruthy();
    for (const section of [
      HOMEPAGE_CONTENT.whySection,
      HOMEPAGE_CONTENT.gatewaySection,
      HOMEPAGE_CONTENT.whereIsItSection,
    ]) {
      expect(section.heading).toBeTruthy();
      expect(section.body).toBeTruthy();
    }
    expect(HOMEPAGE_CONTENT.gatewaySection.heading).not.toContain("Gateway to the Dolomites");
  });
});
