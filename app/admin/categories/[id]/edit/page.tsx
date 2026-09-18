import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/content/categories";

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <Container>
      <Heading level={1}>Edit {category.name}</Heading>
      <CategoryForm category={category} />
    </Container>
  );
}
