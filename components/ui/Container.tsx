export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ maxWidth: "72rem", marginInline: "auto", paddingInline: "var(--space-5)" }}
    >
      {children}
    </div>
  );
}
