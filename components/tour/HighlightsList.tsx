import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";

export function HighlightsList({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null;
  return (
    <div>
      <Reveal>
        <Heading level={2}>Highlights</Heading>
        <ul>
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
