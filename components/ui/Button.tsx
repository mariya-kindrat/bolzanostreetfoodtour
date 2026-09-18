import styles from "@/components/ui/Button.module.css";

export function Button({
  variant = "primary",
  href,
  onClick,
  type = "button",
  children,
}: {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
}) {
  const className = `${styles.button} ${styles[variant]}`;
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
