import styles from "@/components/ui/Kicker.module.css";

export function Kicker({
  onDark,
  children,
}: {
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return <p className={`${styles.kicker} ${onDark ? styles.onDark : ""}`}>{children}</p>;
}
