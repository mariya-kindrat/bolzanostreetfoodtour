import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { PriceTierType } from "@/lib/generated/prisma/client";

describe("Tour schema", () => {
  it("creates a tour with multiple price tiers and custom questions", async () => {
    const tour = await db.tour.create({
      data: {
        slug: `test-tour-${Date.now()}`,
        title: "Test Cooking Class",
        category: { connect: { slug: "cooking-classes" } },
        summary: "A hands-on pasta class in Bolzano's old town.",
        description: "Full-length description goes here.",
        priceTiers: {
          create: [
            { type: PriceTierType.ADULT, priceCents: 8000, minPersons: 1 },
            { type: PriceTierType.CHILD, priceCents: 4000, minPersons: 2 },
          ],
        },
        customQuestions: {
          create: [{ question: "Any dietary restrictions?", required: true }],
        },
      },
      include: { priceTiers: true, customQuestions: true },
    });

    try {
      expect(tour.priceTiers).toHaveLength(2);
      expect(tour.customQuestions).toHaveLength(1);
      expect(tour.priceTiers.find((t) => t.type === PriceTierType.CHILD)?.minPersons).toBe(2);
    } finally {
      await db.tour.delete({ where: { id: tour.id } });
    }
  });
});
