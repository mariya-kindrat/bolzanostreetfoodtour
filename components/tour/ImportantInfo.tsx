import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { TourWithTiers } from "@/lib/content/tours";

const ROWS: { key: keyof TourWithTiers; label: string }[] = [
  { key: "whoShouldTakeIt", label: "Who should take it" },
  { key: "whatsIncluded", label: "What's included" },
  { key: "whatsNotIncluded", label: "What's not included" },
  { key: "whatToWear", label: "What to wear" },
  { key: "weatherPolicy", label: "Weather conditions" },
  { key: "dietaryInfo", label: "Dietary / additional information" },
];

export function ImportantInfo({ tour }: { tour: TourWithTiers }) {
  const rows = ROWS.filter((r) => tour[r.key]);
  if (rows.length === 0) return null;

  return (
    <div>
      <Reveal>
        <Heading level={2}>Important information</Heading>
        {rows.map((r) => (
          <div key={r.key}>
            <Heading level={4}>{r.label}</Heading>
            <Text>{String(tour[r.key])}</Text>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
