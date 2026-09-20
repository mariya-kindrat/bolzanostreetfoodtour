import styles from "@/components/ui/Kicker.module.css";

export function Kicker({
  onDark,
  onSand,
  children,
}: {
  onDark?: boolean;
  /** On the sand section tone, where the default terracotta falls below AA contrast. */
  onSand?: boolean;
  children: React.ReactNode;
}) {
  return <p className={`${styles.kicker} ${onDark ? styles.onDark : ""} ${onSand ? styles.onSand : ""}`}>{children}</p>;
}
