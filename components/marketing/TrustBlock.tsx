import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import styles from "@/components/marketing/TrustBlock.module.css";
import { TRUST_POINTS } from "@/lib/content/global";

export function TrustBlock() {
  return (
    <div data-testid="trust-block">
      <div className={styles.header}>
        <Kicker onDark>Book with confidence</Kicker>
        <Heading level={2} onDark>
          Why book with us?
        </Heading>
      </div>
      <ul className={styles.stamps}>
        {TRUST_POINTS.map((point) => (
          <li key={point.stamp} className={styles.item}>
            <span className={styles.stamp}>{point.stamp}</span>
            <p className={styles.text}>{point.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
