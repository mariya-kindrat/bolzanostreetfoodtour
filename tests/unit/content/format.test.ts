import { describe, expect, it } from "vitest";
import { firstSentence, formatPriceCents } from "@/lib/content/format";

describe("formatPriceCents", () => {
  it("formats whole euros", () => {
    expect(formatPriceCents(10900)).toBe("€109.00");
  });
  it("formats cents", () => {
    expect(formatPriceCents(4950)).toBe("€49.50");
  });
});

describe("firstSentence", () => {
  it("returns text up to and including the first period", () => {
    expect(firstSentence("Taste the food. Visit the market. See the sights.")).toBe(
      "Taste the food.",
    );
  });
  it("returns the whole string when there is no period", () => {
    expect(firstSentence("No punctuation here")).toBe("No punctuation here");
  });
});
