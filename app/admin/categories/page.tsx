import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { getAllCategoriesForAdmin } from "@/lib/content/categories";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <Container>
      <Heading level={1}>Categories</Heading>
      <p>
        Drives the homepage hero rotation and each category&apos;s catalog page
        (<code>/&lt;slug&gt;</code>). Adding a category here gives it a working catalog page
        automatically — no developer needed.
      </p>
      <Button href="/admin/categories/new" variant="primary">
        New category
      </Button>
      <table style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Name</th>
            <th style={{ textAlign: "left" }}>Slug</th>
            <th style={{ textAlign: "left" }}>Sort</th>
            <th style={{ textAlign: "left" }}>Active</th>
            <th style={{ textAlign: "left" }}>Bookable</th>
            <th style={{ textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <Link href={`/${category.slug}`}>/{category.slug}</Link>
              </td>
              <td>{category.sortOrder}</td>
              <td>{category.isActive ? "Yes" : "No"}</td>
              <td>{category.isBookable ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                <DeleteCategoryButton id={category.id} name={category.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
