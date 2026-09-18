import { db } from "@/lib/db";
import type { Category } from "@/lib/generated/prisma/client";

export function getActiveCategories(): Promise<Category[]> {
  return db.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return db.category.findFirst({ where: { slug, isActive: true } });
}

// Admin CRUD reads every category, active or not — unlike the public-facing
// helpers above, which only ever show what's currently live on the site.
export function getAllCategoriesForAdmin(): Promise<Category[]> {
  return db.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getCategoryById(id: string): Promise<Category | null> {
  return db.category.findUnique({ where: { id } });
}
