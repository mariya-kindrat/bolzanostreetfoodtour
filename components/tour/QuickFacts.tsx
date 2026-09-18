import type { TourWithTiers } from "@/lib/content/tours";

const FACTS: { key: keyof TourWithTiers; label: string }[] = [
  { key: "language", label: "Language" },
  { key: "daysOffered", label: "Offered on" },
  { key: "startingTime", label: "Starting time" },
  { key: "durationLabel", label: "Duration" },
  { key: "meetingPoint", label: "Meeting point" },
  { key: "groupSizeLabel", label: "Group size" },
];

export function QuickFacts({ tour }: { tour: TourWithTiers }) {
  const present = FACTS.filter((f) => tour[f.key]);
  if (present.length === 0) return null;

  return (
    <dl
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      }}
    >
      {present.map((f) => (
        <div key={f.key}>
          <dt style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.7 }}>
            {f.label}
          </dt>
          <dd>{String(tour[f.key])}</dd>
        </div>
      ))}
    </dl>
  );
}
