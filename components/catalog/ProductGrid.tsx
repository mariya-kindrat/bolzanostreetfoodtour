import { TourCard } from "@/components/marketing/TourCard";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/catalog/ProductGrid.module.css";

export function ProductGrid({ tours }: { tours: TourWithTiers[] }) {
  return (
    <div className={styles.grid}>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} catalog />
      ))}
    </div>
  );
}
