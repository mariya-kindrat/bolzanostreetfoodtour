import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <Container>
      <Heading level={1}>New category</Heading>
      <CategoryForm />
    </Container>
  );
}
