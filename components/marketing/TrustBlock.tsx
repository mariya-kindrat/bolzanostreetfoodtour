import { Heading } from "@/components/ui/Heading";
import { TRUST_POINTS } from "@/lib/content/global";

export function TrustBlock() {
  return (
    <div>
      <Heading level={2} onDark>
        Why book with us?
      </Heading>
      <ul style={{ color: "var(--color-cream)" }}>
        {TRUST_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
