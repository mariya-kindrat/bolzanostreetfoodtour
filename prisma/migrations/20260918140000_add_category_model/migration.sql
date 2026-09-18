-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBookable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Seed the 4 categories that replace the old TourCategory enum values, with
-- fixed ids so the Tour backfill below can reference them directly. Reuses
-- the per-category hero photos already sourced in Task 4 (see
-- prisma/seed.ts's old HERO_IMAGE_BY_CATEGORY) as placeholder category
-- photos, and the existing catalog pages' intro copy for descriptions.
INSERT INTO "Category" ("id", "slug", "name", "description", "photoUrl", "altText", "sortOrder", "isActive", "isBookable", "updatedAt") VALUES
  ('cat_street_food_tour', 'street-food-tours', 'Street Food Tours', 'Walking tours through Bolzano''s historic center, tasting local specialties stop by stop — a mix of Mediterranean and Austrian cuisine with centuries of history along the way.', '/images/tours/street-food-hero.jpg', 'A bustling market street in Bolzano''s old town, with food stalls, fruit stands, and the frescoed Casa al Torchio building', 0, true, true, CURRENT_TIMESTAMP),
  ('cat_cooking_class', 'cooking-classes', 'Cooking Classes', 'Learn centuries-old South Tyrolean recipes from local chefs — in a farmhouse on the Ritten plateau, at a winery on the Wine Road, or after a Dolomites hike.', '/images/tours/cooking-class-hero.jpg', 'The Ritten plateau''s earth pyramids and green farmland above Bolzano, with the Dolomites in the distance', 1, true, true, CURRENT_TIMESTAMP),
  ('cat_wine_tour', 'wine-tours', 'Wine Tours', 'From full-day Wine Road excursions to a rooftop aperitivo walk or a craft-beer evening — discover South Tyrol''s indigenous wines and 1,000-year-old beer tradition.', '/images/tours/wine-tour-hero.jpg', 'Dark grape clusters hanging in a South Tyrol vineyard row', 2, true, true, CURRENT_TIMESTAMP),
  ('cat_winter_tour', 'winter-tours', 'Winter Tours', 'Custom, quote-only winter excursions across South Tyrol — Christmas markets, husky sledding, and snowshoeing, every tour tailored to your group.', '/images/tours/winter-tour-hero.jpg', 'A lit Christmas market stall at night in Bolzano, with ornaments for sale beneath a statue on a column', 3, true, false, CURRENT_TIMESTAMP);

-- AlterTable: add categoryId as nullable first so the 21 existing Tour rows
-- can be backfilled from the old enum column before NOT NULL is enforced.
ALTER TABLE "Tour" ADD COLUMN "categoryId" TEXT;

-- Backfill from the old enum column.
UPDATE "Tour" SET "categoryId" = 'cat_street_food_tour' WHERE "category" = 'STREET_FOOD_TOUR';
UPDATE "Tour" SET "categoryId" = 'cat_cooking_class' WHERE "category" = 'COOKING_CLASS';
UPDATE "Tour" SET "categoryId" = 'cat_wine_tour' WHERE "category" = 'WINE_TOUR';
UPDATE "Tour" SET "categoryId" = 'cat_winter_tour' WHERE "category" = 'WINTER_TOUR';

-- Now safe to enforce NOT NULL and drop the old enum column/type.
ALTER TABLE "Tour" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Tour" DROP COLUMN "category";
DROP TYPE "TourCategory";

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
