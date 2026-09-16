import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { CouponType, PriceTierType, TourCategory } from "@/lib/generated/prisma/client";

describe("Booking schema", () => {
  it("creates a booking with participants and an applied coupon", async () => {
    const tour = await db.tour.create({
      data: { slug: `test-tour-${Date.now()}`, title: "Test Tour", category: TourCategory.COOKING_CLASS, summary: "s", description: "d" },
    });
    const coupon = await db.coupon.create({
      data: { code: `TEST${Date.now()}`, type: CouponType.PERCENTAGE, value: 10 },
    });

    try {
      const booking = await db.booking.create({
        data: {
          tourId: tour.id,
          date: new Date("2026-06-01"),
          customerName: "Jane Doe",
          customerEmail: "jane@example.com",
          totalCents: 14400,
          couponId: coupon.id,
          participants: { create: [{ tier: PriceTierType.ADULT, count: 2 }] },
        },
        include: { participants: true, coupon: true },
      });

      expect(booking.participants).toHaveLength(1);
      expect(booking.coupon?.code).toBe(coupon.code);

      await db.booking.delete({ where: { id: booking.id } });
    } finally {
      await db.coupon.delete({ where: { id: coupon.id } });
      await db.tour.delete({ where: { id: tour.id } });
    }
  });
});
