import { Container } from "@/components/ui/Container";
import type { TourWithTiers } from "@/lib/content/tours";
import styles from "@/components/tour/QuickFacts.module.css";

// Duration is shown as a hero badge, so it is not repeated here.
const FACTS: { key: keyof TourWithTiers; label: string }[] = [
  { key: "language", label: "Language" },
  { key: "daysOffered", label: "Offered on" },
  { key: "startingTime", label: "Starting time" },
  { key: "meetingPoint", label: "Meeting point" },
  { key: "groupSizeLabel", label: "Group size" },
  { key: "tourType", label: "Tour type" },
];

export function QuickFacts({ tour }: { tour: TourWithTiers }) {
  const present = FACTS.filter((f) => tour[f.key]);
  if (present.length === 0) return null;

  return (
    <Container>
      <dl className={styles.strip}>
        {present.map((f) => (
          <div key={f.key} className={styles.fact}>
            <dt>{f.label}</dt>
            <dd>{String(tour[f.key])}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
