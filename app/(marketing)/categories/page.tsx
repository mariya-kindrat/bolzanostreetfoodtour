import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { getActiveCategories } from "@/lib/content/categories";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tour categories in Bolzano & South Tyrol",
  description: "Street food tours, cooking classes, wine tours and winter tours in Bolzano.",
};

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Our categories</Heading>
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {categories.map((category) => (
            <Link key={category.id} href={`/${category.slug}`}>
              <article
                style={{
                  border: "1px solid var(--color-cream-dark)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", height: 200 }}>
                  <Image
                    src={category.photoUrl}
                    alt={category.altText}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1rem" }}>
                  <Heading level={3}>{category.name}</Heading>
                  <Text size="sm">{category.description}</Text>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
