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

/** First tour of each category, in category order, capped at `max`. */
export function pickOnePerCategory(tours: TourWithTiers[], max: number): TourWithTiers[] {
  const byCategory = new Map<string, TourWithTiers>();
  for (const tour of tours) {
    if (!byCategory.has(tour.categoryId)) byCategory.set(tour.categoryId, tour);
  }
  return [...byCategory.values()]
    .sort((a, b) => a.category.sortOrder - b.category.sortOrder)
    .slice(0, max);
}

export async function getFooterTours(): Promise<TourWithTiers[]> {
  return pickOnePerCategory(await getAllActiveTours(), 4);
}
