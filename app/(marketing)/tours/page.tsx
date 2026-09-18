import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getAllActiveTours } from "@/lib/content/tours";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All tours in Bolzano & South Tyrol",
  description: "Street food tours, cooking classes, wine tours and winter tours in Bolzano.",
};

export default async function ToursPage() {
  const tours = await getAllActiveTours();

  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Our tours</Heading>
        <ProductGrid tours={tours} />
      </Container>
    </Section>
  );
}
