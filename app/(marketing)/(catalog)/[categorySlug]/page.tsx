import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getToursByCategoryId } from "@/lib/content/tours";
import { getActiveCategories, getCategoryBySlug } from "@/lib/content/categories";

export const revalidate = 3600;

// Replaces the 3 previously hand-built catalog pages (cooking-classes,
// wine-tours, winter-tours) with one route driven by the Category table —
// a category an admin adds gets a working catalog page automatically, no
// new route file needed.
export async function generateStaticParams() {
  const categories = await getActiveCategories();
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[categorySlug]">): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} in Bolzano & South Tyrol`,
    description: category.description.slice(0, 155),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[categorySlug]">) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const tours = await getToursByCategoryId(category.id);

  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>{category.name}</Heading>
        <Text>{category.description}</Text>
        <ProductGrid tours={tours} />
      </Container>
    </Section>
  );
}
