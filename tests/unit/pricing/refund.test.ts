import { describe, expect, it } from "vitest";
import { calculateRefund } from "@/lib/pricing/refund";

const tourDate = new Date("2026-08-15T00:00:00Z");

function cancelDaysBefore(days: number): Date {
  return new Date(tourDate.getTime() - days * 24 * 60 * 60 * 1000);
}

describe("calculateRefund", () => {
  it("refunds 100% at exactly 7 days before", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(7), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(100);
    expect(result.refundCents).toBe(10000);
  });

  it("refunds 50% at exactly 6 days before", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(6), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(50);
    expect(result.refundCents).toBe(5000);
  });

  it("refunds 50% at exactly 3 days before", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(3), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(50);
  });

  it("refunds 0% at exactly 2 days before", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(2), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(0);
    expect(result.refundCents).toBe(0);
  });

  it("refunds 0% for a same-day cancellation", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(0), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(0);
  });

  it("refunds 100% for a cancellation well in advance", () => {
    const result = calculateRefund({ tourDate, cancellationDate: cancelDaysBefore(30), totalPaidCents: 10000 });
    expect(result.refundPercent).toBe(100);
  });
});
