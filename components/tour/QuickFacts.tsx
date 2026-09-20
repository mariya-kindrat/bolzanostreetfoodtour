import { Container } from "@/components/ui/Container";
import { FactsStrip } from "@/components/ui/FactsStrip";
import type { TourWithTiers } from "@/lib/content/tours";

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
  const facts = FACTS.filter((f) => tour[f.key]).map((f) => ({
    label: f.label,
    value: String(tour[f.key]),
  }));
  if (facts.length === 0) return null;

  return (
    <Container>
      <FactsStrip facts={facts} />
    </Container>
  );
}
