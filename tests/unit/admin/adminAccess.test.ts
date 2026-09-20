import { describe, expect, it } from "vitest";
import { isAdminEmail, parseAdminEmails } from "@/lib/admin/adminAccess";

describe("parseAdminEmails", () => {
  it("splits on commas, trims, lowercases and dedupes", () => {
    expect(parseAdminEmails(" Owner@Example.com, second@example.com ,owner@example.com ")).toEqual([
      "owner@example.com",
      "second@example.com",
    ]);
  });

  it("returns an empty list for an unset, empty or blank value", () => {
    expect(parseAdminEmails(undefined)).toEqual([]);
    expect(parseAdminEmails("")).toEqual([]);
    expect(parseAdminEmails(" , ,")).toEqual([]);
  });
});

describe("isAdminEmail", () => {
  const allowed = ["owner@example.com"];

  it("allows a user with any verified email on the list, ignoring case", () => {
    expect(isAdminEmail(["Other@example.com", "OWNER@example.com"], allowed)).toBe(true);
  });

  it("denies a user whose emails are not on the list", () => {
    expect(isAdminEmail(["stranger@example.com"], allowed)).toBe(false);
  });

  it("denies everyone when the allow-list is empty (fail closed)", () => {
    expect(isAdminEmail(["owner@example.com"], [])).toBe(false);
  });

  it("denies a user with no verified emails", () => {
    expect(isAdminEmail([], allowed)).toBe(false);
  });
});
