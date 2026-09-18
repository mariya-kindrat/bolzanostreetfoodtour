import { ProductCard } from "@/components/catalog/ProductCard";
import type { TourWithTiers } from "@/lib/content/tours";

export function ProductGrid({ tours }: { tours: TourWithTiers[] }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {tours.map((tour) => (
        <ProductCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
