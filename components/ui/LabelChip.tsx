import styles from "@/components/ui/LabelChip.module.css";

export function LabelChip({
  number,
  label,
  corner = "top-right",
}: {
  number: string;
  label: string;
  corner?: "top-right" | "bottom-left";
}) {
  const cornerClass = corner === "top-right" ? styles.topRight : styles.bottomLeft;
  return (
    <div className={`${styles.chip} ${cornerClass}`}>
      <div className={styles.chipShape}>
        <span className={styles.number}>No. {number}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <span className={styles.seal} aria-hidden="true">
        ★
      </span>
    </div>
  );
}
