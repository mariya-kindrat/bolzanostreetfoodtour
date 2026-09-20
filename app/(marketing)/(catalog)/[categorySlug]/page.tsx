import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CategoryChips } from "@/components/catalog/CategoryChips";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
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

  const [tours, categories] = await Promise.all([
    getToursByCategoryId(category.id),
    getActiveCategories(),
  ]);

  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="Tour category"
          title={category.name}
          lead={category.description}
          photo={{ src: category.photoUrl, alt: category.altText }}
        />
        <CategoryChips categories={categories} activeSlug={category.slug} />
        <ProductGrid tours={tours} />
      </Container>
    </Section>
  );
}
