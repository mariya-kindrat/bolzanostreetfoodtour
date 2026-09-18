const SIZE: Record<"sm" | "base" | "lg", string> = {
  sm: "var(--type-sm)",
  base: "var(--type-base)",
  lg: "var(--type-lg)",
};

export function Text({
  size = "base",
  muted,
  onDark,
  children,
}: {
  size?: "sm" | "base" | "lg";
  muted?: boolean;
  /** Set on a dark section background (e.g. Section tone="forest") so the
   * text keeps WCAG-AA contrast instead of its default near-black ink. */
  onDark?: boolean;
  children: React.ReactNode;
}) {
  const color = onDark
    ? muted
      ? "var(--color-cream-dark)"
      : "var(--color-cream)"
    : muted
      ? "#5b5750"
      : "var(--color-ink)";
  return (
    <p
      style={{
        fontSize: SIZE[size],
        color,
        lineHeight: 1.6,
        marginBottom: "var(--space-4)",
      }}
    >
      {children}
    </p>
  );
}
