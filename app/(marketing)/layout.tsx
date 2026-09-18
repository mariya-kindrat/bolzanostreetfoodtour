import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { getActiveCategories } from "@/lib/content/categories";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  const categories = await getActiveCategories();
  return (
    <>
      <Header categories={categories} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
