import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { getActiveCategories } from "@/lib/content/categories";
import { getFooterTours } from "@/lib/content/tours";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  const [categories, footerTours] = await Promise.all([getActiveCategories(), getFooterTours()]);
  return (
    <>
      <Header categories={categories} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer categories={categories} tours={footerTours} />
    </>
  );
}
