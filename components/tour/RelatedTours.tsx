import { TourCard } from "@/components/marketing/TourCard";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/RelatedTours.module.css";

export function RelatedTours({ tours }: { tours: TourWithTiers[] }) {
  if (tours.length === 0) return null;
  return (
    <Section tone="sand">
      <Container>
        <Kicker onSand>Keep exploring</Kicker>
        <Heading level={2}>More tours to explore</Heading>
        <div className={styles.grid}>
          {tours.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
