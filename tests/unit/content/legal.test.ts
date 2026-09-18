import { describe, expect, it } from "vitest";
import { LEGAL_REVIEW_NOTICE, PRIVACY_POLICY_SECTIONS, TERMS_SECTIONS } from "@/lib/content/legal";

describe("legal content", () => {
  it("has LEGAL_REVIEW_NOTICE that is not empty", () => {
    expect(LEGAL_REVIEW_NOTICE).toBeTruthy();
    expect(LEGAL_REVIEW_NOTICE.length).toBeGreaterThan(0);
  });

  it("LEGAL_REVIEW_NOTICE mentions legal advice and lawyer review", () => {
    expect(LEGAL_REVIEW_NOTICE).toContain("not legal advice");
    expect(LEGAL_REVIEW_NOTICE).toContain("reviewed by a lawyer");
  });

  it("has PRIVACY_POLICY_SECTIONS with expected structure", () => {
    expect(Array.isArray(PRIVACY_POLICY_SECTIONS)).toBe(true);
    expect(PRIVACY_POLICY_SECTIONS.length).toBeGreaterThan(0);
    PRIVACY_POLICY_SECTIONS.forEach((section) => {
      expect(section.heading).toBeTruthy();
      expect(section.body).toBeTruthy();
      expect(typeof section.heading).toBe("string");
      expect(typeof section.body).toBe("string");
    });
  });

  it("PRIVACY_POLICY_SECTIONS contains expected sections", () => {
    const headings = PRIVACY_POLICY_SECTIONS.map((s) => s.heading);
    expect(headings).toContain("What we collect");
    expect(headings).toContain("How we use your information");
    expect(headings).toContain("Data processors we use");
    expect(headings).toContain("Your rights under GDPR");
    expect(headings).toContain("Cookies");
  });

  it("PRIVACY_POLICY_SECTIONS mentions all required data processors", () => {
    const allText = PRIVACY_POLICY_SECTIONS.map((s) => s.body).join(" ");
    expect(allText).toContain("Stripe");
    expect(allText).toContain("Clerk");
    expect(allText).toContain("Resend");
    expect(allText).toContain("OpenRouter");
  });

  it("has TERMS_SECTIONS with expected structure", () => {
    expect(Array.isArray(TERMS_SECTIONS)).toBe(true);
    expect(TERMS_SECTIONS.length).toBeGreaterThan(0);
    TERMS_SECTIONS.forEach((section) => {
      expect(section.heading).toBeTruthy();
      expect(section.body).toBeTruthy();
      expect(typeof section.heading).toBe("string");
      expect(typeof section.body).toBe("string");
    });
  });

  it("TERMS_SECTIONS contains expected sections", () => {
    const headings = TERMS_SECTIONS.map((s) => s.heading);
    expect(headings).toContain("Bookings and payment");
    expect(headings).toContain("Cancellation and refund policy");
    expect(headings).toContain("Private Transfers");
    expect(headings).toContain("Conduct and suitability");
  });

  it("cancellation policy mentions 7 days, 3-6 days, and 2 days thresholds", () => {
    const cancellationSection = TERMS_SECTIONS.find(
      (s) => s.heading === "Cancellation and refund policy",
    );
    expect(cancellationSection?.body).toContain("7 days");
    expect(cancellationSection?.body).toContain("3 and 6 days");
    expect(cancellationSection?.body).toContain("within 2 days");
  });
});
