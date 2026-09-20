import styles from "@/components/ui/FactsStrip.module.css";

export type Fact = { label: string; value: string };

export function FactsStrip({ facts }: { facts: Fact[] }) {
  return (
    <dl className={styles.strip}>
      {facts.map((f) => (
        <div key={f.label} className={styles.fact}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
