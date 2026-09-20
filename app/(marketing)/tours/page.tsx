import type { Metadata } from "next";
import { CategoryChips } from "@/components/catalog/CategoryChips";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getActiveCategories } from "@/lib/content/categories";
import { getAllActiveTours } from "@/lib/content/tours";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All tours in Bolzano & South Tyrol",
  description: "Street food tours, cooking classes, wine tours and winter tours in Bolzano.",
};

export default async function ToursPage() {
  const [tours, categories] = await Promise.all([getAllActiveTours(), getActiveCategories()]);

  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="All tours"
          title="Our tours"
          lead="Small-group street food, wine and cooking tours through Bolzano and South Tyrol, led by licensed local guides."
        />
        <CategoryChips categories={categories} />
        <ProductGrid tours={tours} />
      </Container>
    </Section>
  );
}
