import { describe, expect, it } from "vitest";
import { ABOUT_CONTENT, CONTACT_CONTENT } from "@/lib/content/about-contact";

describe("about-contact content", () => {
  it("has ABOUT_CONTENT with heroTitle, lead, paragraphs and sign-off", () => {
    expect(ABOUT_CONTENT.heroTitle).toBe("About Us");
    expect(ABOUT_CONTENT.lead).toBeTruthy();
    expect(ABOUT_CONTENT.paragraphs.length).toBeGreaterThan(0);
    expect(ABOUT_CONTENT.signOff).toBeTruthy();
  });

  it("about copy contains signature content phrases", () => {
    const copy = [ABOUT_CONTENT.lead, ...ABOUT_CONTENT.paragraphs, ABOUT_CONTENT.signOff].join(" ");
    expect(copy).toContain("group of food lovers");
    expect(copy).toContain("Bolzano");
    expect(copy).toContain("Buon Appetito");
  });

  it("has CONTACT_CONTENT with heroTitle, intro, and meeting point directions", () => {
    expect(CONTACT_CONTENT.heroTitle).toBe("Contact");
    expect(CONTACT_CONTENT.intro).toBeTruthy();
    expect(CONTACT_CONTENT.meetingPointDirections).toBeTruthy();
  });

  it("contact intro mentions assistance", () => {
    expect(CONTACT_CONTENT.intro).toContain("team will be more than happy to assist");
  });

  it("meeting point directions contain required landmark info", () => {
    expect(CONTACT_CONTENT.meetingPointDirections).toContain("Piazza Walther");
    expect(CONTACT_CONTENT.meetingPointDirections).toContain("Train Station");
  });
});
