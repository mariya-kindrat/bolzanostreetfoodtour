import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CONTACT_INFO, FOOTER_LEGAL_LINKS, NAV_ITEMS } from "@/lib/content/global";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-forest-dark)",
        color: "var(--color-cream)",
        marginTop: "auto",
      }}
    >
      <Container>
        <div
          style={{
            paddingBlock: "3rem",
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <p>{CONTACT_INFO.email}</p>
            <p>Tel: {CONTACT_INFO.phoneItaly}</p>
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} style={{ display: "block" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <p style={{ paddingBlock: "1rem", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          © {new Date().getFullYear()} Bolzano Street Food Tour - Italy Destination Services LLC -
          All rights reserved
        </p>
      </Container>
    </footer>
  );
}
