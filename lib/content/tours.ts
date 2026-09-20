import { cache } from "react";
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

/** Cached per request: the footer and the related-tours strip share one query. */
export const getAllActiveTours = cache((): Promise<TourWithTiers[]> =>
  db.tour.findMany({
    where: { isActive: true },
    include: { priceTiers: true, category: true },
    orderBy: { title: "asc" },
  }),
);

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

/** Other tours, same-category ones first, capped at `max`. */
export function pickRelatedTours(
  current: TourWithTiers,
  all: TourWithTiers[],
  max: number,
): TourWithTiers[] {
  const others = all.filter((t) => t.id !== current.id);
  const sameCategory = others.filter((t) => t.categoryId === current.categoryId);
  const rest = others.filter((t) => t.categoryId !== current.categoryId);
  return [...sameCategory, ...rest].slice(0, max);
}

export async function getRelatedTours(current: TourWithTiers, max: number) {
  return pickRelatedTours(current, await getAllActiveTours(), max);
}

export function countToursByCategory(tours: TourWithTiers[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of tours) counts.set(t.categoryId, (counts.get(t.categoryId) ?? 0) + 1);
  return counts;
}
