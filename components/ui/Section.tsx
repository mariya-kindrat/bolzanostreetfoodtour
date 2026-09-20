import styles from "@/components/ui/Section.module.css";

const TONE_CLASS: Record<"cream" | "forest" | "forest-dark" | "sand" | "white", string> = {
  cream: styles.cream,
  forest: styles.forest,
  "forest-dark": styles.forestDark,
  sand: styles.sand,
  white: styles.white,
};

export function Section({
  tone = "white",
  children,
}: {
  tone?: "cream" | "forest" | "forest-dark" | "sand" | "white";
  children: React.ReactNode;
}) {
  const className = `${styles.section} ${TONE_CLASS[tone]}`;
  return <section className={className}>{children}</section>;
}
