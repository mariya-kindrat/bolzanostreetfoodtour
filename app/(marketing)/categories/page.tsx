import type { Metadata } from "next";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CategoryTiles } from "@/components/catalog/CategoryTiles";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getActiveCategories } from "@/lib/content/categories";
import { countToursByCategory, getAllActiveTours } from "@/lib/content/tours";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tour categories in Bolzano & South Tyrol",
  description: "Street food tours, cooking classes, wine tours and winter tours in Bolzano.",
};

export default async function CategoriesPage() {
  const [categories, tours] = await Promise.all([getActiveCategories(), getAllActiveTours()]);

  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="Explore"
          title="Our categories"
          lead="Pick a way to taste Bolzano and South Tyrol: street food, cooking classes, wine and beer, or winter markets."
        />
        <CategoryTiles categories={categories} counts={countToursByCategory(tours)} />
      </Container>
    </Section>
  );
}
