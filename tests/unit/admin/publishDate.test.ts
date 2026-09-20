import { describe, expect, it } from "vitest";
import { fromDateInputValue, toDateInputValue } from "@/lib/admin/publishDate";

describe("toDateInputValue", () => {
  it("returns an empty string for null, undefined and invalid dates", () => {
    expect(toDateInputValue(null)).toBe("");
    expect(toDateInputValue(undefined)).toBe("");
    expect(toDateInputValue(new Date("garbage"))).toBe("");
  });

  it("formats in UTC without shifting a first-of-month midnight date", () => {
    expect(toDateInputValue(new Date("2026-03-01T00:00:00.000Z"))).toBe("2026-03-01");
  });
});

describe("fromDateInputValue", () => {
  it("returns noon UTC for a valid date", () => {
    expect(fromDateInputValue("2026-03-01")).toBe("2026-03-01T12:00:00.000Z");
  });

  it("round trips", () => {
    const iso = fromDateInputValue("2025-12-31");
    expect(toDateInputValue(new Date(iso as string))).toBe("2025-12-31");
  });

  it("returns undefined for empty or invalid values", () => {
    expect(fromDateInputValue("")).toBeUndefined();
    expect(fromDateInputValue("garbage")).toBeUndefined();
    expect(fromDateInputValue("2020-13-45")).toBeUndefined();
    expect(fromDateInputValue("2026-02-30")).toBeUndefined();
  });
});
