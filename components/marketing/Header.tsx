"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, withCategoryLinks, type NavItem } from "@/lib/content/global";
import type { Category } from "@/lib/generated/prisma/client";
import { computeHeaderScrollTint } from "@/lib/header/headerScrollTint";
import { BrandBadge } from "@/components/marketing/BrandBadge";
import styles from "@/components/marketing/Header.module.css";

// Scroll distance (px) over which the header's tint/blur/shadow fully ramp
// in — a gradual blend, not an on/off toggle at a fixed threshold.
const SCROLL_RANGE = 240;

// One nav entry: a plain link, or (when `children` is set) a link whose
// dropdown opens on hover or keyboard focus. In the mobile list (`inline`)
// the children are always shown beneath the link — there is no hover there,
// and tapping the link itself navigates to its own page.
function NavLink({ item, inline = false }: { item: NavItem; inline?: boolean }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <li>
        <Link href={item.href}>{item.label}</Link>
      </li>
    );
  }

  return (
    <li
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      className={styles.dropdownWrapper}
    >
      <Link href={item.href}>{item.label}</Link>
      {(open || inline) && (
        <ul className={inline ? styles.inlineChildren : styles.dropdown}>
          {item.children.map((child) => (
            <li key={child.href}>
              <Link href={child.href} className={styles.dropdownLink}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

const RIGHT_ITEMS = NAV_ITEMS.filter((item) => item.section === "right");

export function Header({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Computed per render (not a module-level constant like RIGHT_ITEMS,
  // since it depends on the categories prop): the "Tours" dropdown's
  // children with live category catalog links appended.
  const leftItems = withCategoryLinks(
    NAV_ITEMS.filter((item) => item.section === "left"),
    categories,
  );
  const mobileItems = [...leftItems, ...RIGHT_ITEMS];

  useEffect(() => {
    // Coalesce to one state update per animation frame — native scroll
    // events can fire far more often than that during a fast swipe/fling,
    // and each update re-renders the header (recomputed rgba/blur strings).
    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrollProgress(Math.min(window.scrollY / SCROLL_RANGE, 1));
        rafId = null;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const tint = computeHeaderScrollTint(scrollProgress);
  const headerStyle: React.CSSProperties = {
    backgroundColor: tint.backgroundColor,
    backdropFilter: tint.blurPx > 0.5 ? `blur(${tint.blurPx.toFixed(1)}px)` : undefined,
    WebkitBackdropFilter: tint.blurPx > 0.5 ? `blur(${tint.blurPx.toFixed(1)}px)` : undefined,
    borderBottom: `1px solid rgba(236, 230, 214, ${tint.borderAlpha.toFixed(2)})`,
    boxShadow: `0 2px 5px rgba(28, 27, 25, ${tint.shadowAlpha.toFixed(3)})`,
  };

  return (
    <header className={styles.header} style={headerStyle}>
      <Container>
        <nav aria-label="Primary" className={`primary-nav ${styles.nav}`}>
          <ul className={`${styles.desktopGroup} ${styles.desktopGroupLeft}`}>
            {leftItems.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </ul>

          <Link href="/" className={styles.brand}>
            <BrandBadge size={56} />
            <span className={styles.wordmark}>Bolzano Street Food Tour</span>
          </Link>

          <div className={styles.desktopGroupRight}>
            <ul className={styles.desktopGroup}>
              {RIGHT_ITEMS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </ul>
            <Button variant="primary" href="/tours">
              Book a tour
            </Button>
          </div>

          <div className={styles.mobileActions}>
            {/* Booking is the primary conversion action — it stays visible
                on mobile at all times, not hidden behind the Menu
                disclosure the way the rest of the nav is. */}
            <Button variant="primary" href="/tours">
              Book a tour
            </Button>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-nav-list"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>
          </div>
          <ul
            id="primary-nav-list"
            className={menuOpen ? `${styles.mobileGroup} is-open` : styles.mobileGroup}
          >
            {/* Only rendered while open — it's display:none while closed
                anyway, and this resets each NavLink's own open/closed
                dropdown state on every reopen instead of leaving a
                submenu expanded from a previous visit. */}
            {menuOpen && mobileItems.map((item) => <NavLink key={item.label} item={item} inline />)}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
