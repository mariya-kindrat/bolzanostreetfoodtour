import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";
import styles from "@/components/tour/TourBody.module.css";

export function HighlightsList({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null;
  return (
    <div className={styles.block}>
      <Reveal>
        <Heading level={2}>Highlights</Heading>
        <ul className={styles.highlights}>
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
