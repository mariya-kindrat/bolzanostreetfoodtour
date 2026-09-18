import { db } from "@/lib/db";
import type { Tour, PriceTier, Category } from "@/lib/generated/prisma/client";

export type TourWithTiers = Tour & { priceTiers: PriceTier[]; category: Category };

export function getToursByCategoryId(categoryId: string): Promise<TourWithTiers[]> {
  return db.tour.findMany({
    where: { categoryId, isActive: true },
    include: { priceTiers: true, category: true },
    orderBy: { title: "asc" },
  });
}

export function getAllActiveTours(): Promise<TourWithTiers[]> {
  return db.tour.findMany({
    where: { isActive: true },
    include: { priceTiers: true, category: true },
    orderBy: { title: "asc" },
  });
}

export function getTourBySlug(slug: string): Promise<TourWithTiers | null> {
  return db.tour.findFirst({
    where: { slug, isActive: true },
    include: { priceTiers: true, category: true },
  });
}

export async function getAllTourSlugs(): Promise<string[]> {
  const tours = await db.tour.findMany({ where: { isActive: true }, select: { slug: true } });
  return tours.map((t) => t.slug);
}
