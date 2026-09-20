import { Heading } from "@/components/ui/Heading";
import { STANDARD_CANCELLATION_POLICY } from "@/lib/content/global";
import styles from "@/components/tour/TourBody.module.css";

export function CancellationPolicy() {
  return (
    <div className={styles.policy}>
      <Heading level={3}>Cancellation policy</Heading>
      <p>{STANDARD_CANCELLATION_POLICY}</p>
    </div>
  );
}
