type Level = 1 | 2 | 3 | 4;

const SIZE_BY_LEVEL: Record<Level, string> = {
  1: "var(--type-h1)",
  2: "var(--type-h2)",
  3: "var(--type-h3)",
  4: "var(--type-h4)",
};

const MARGIN_BOTTOM_BY_LEVEL: Record<Level, string> = {
  1: "var(--space-5)",
  2: "var(--space-4)",
  3: "var(--space-3)",
  4: "var(--space-2)",
};

export function Heading({
  level,
  as,
  onDark,
  children,
}: {
  level: Level;
  as?: `h${Level}`;
  /** Set on a dark section background (e.g. Section tone="forest") so the
   * heading keeps WCAG-AA contrast instead of its default dark-on-dark. */
  onDark?: boolean;
  children: React.ReactNode;
}) {
  const Tag = (as ?? `h${level}`) as `h${Level}`;
  return (
    <Tag
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontSize: SIZE_BY_LEVEL[level],
        color: onDark ? "var(--color-cream)" : "var(--color-forest-dark)",
        lineHeight: 1.15,
        marginBottom: MARGIN_BOTTOM_BY_LEVEL[level],
      }}
    >
      {children}
    </Tag>
  );
}
