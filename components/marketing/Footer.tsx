import Image from "next/image";
import Link from "next/link";
import { BrandBadge } from "@/components/marketing/BrandBadge";
import { SocialIcons } from "@/components/marketing/SocialIcons";
import { Container } from "@/components/ui/Container";
import styles from "@/components/marketing/Footer.module.css";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";
import {
  BRAND,
  CONTACT_INFO,
  FOOTER_BLURB,
  FOOTER_LEGAL_LINKS,
  NAV_ITEMS,
  telHref,
} from "@/lib/content/global";
import type { Category } from "@/lib/generated/prisma/client";

const RIDGE_PATH =
  "M0 48 L0 30 L90 18 L150 30 L240 6 L300 24 L380 12 L470 32 L560 14 L640 26 L720 4 " +
  "L790 22 L880 10 L960 30 L1050 16 L1140 28 L1230 8 L1320 26 L1380 18 L1440 30 L1440 48 Z";

export function Footer({
  categories,
  tours,
}: {
  categories: Category[];
  tours: TourWithTiers[];
}) {
  const company = NAV_ITEMS.filter((item) => item.label !== "Home" && item.label !== "Tours");
  const subnav = [...company, ...FOOTER_LEGAL_LINKS];

  return (
    <footer className={styles.footer}>
      <svg className={styles.ridge} viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path d={RIDGE_PATH} />
      </svg>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <BrandBadge size={88} />
            <p className={styles.tagline}>{BRAND.tagline}</p>
            <p className={styles.blurb}>{FOOTER_BLURB}</p>
            <SocialIcons />
          </div>
          <div>
            <h2 className={styles.heading}>Contact</h2>
            <ul className={styles.list}>
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className={styles.link}>
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={telHref(CONTACT_INFO.phoneItaly)} className={styles.link}>
                  Italy {CONTACT_INFO.phoneItaly}
                </a>
              </li>
              <li>
                <a href={telHref(CONTACT_INFO.phoneUsTollFree, "+1")} className={styles.link}>
                  US toll-free {CONTACT_INFO.phoneUsTollFree}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.heading}>Explore</h2>
            <ul className={styles.list}>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className={styles.link}>
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className={styles.link}>
                  All tours
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.heading}>Our tours</h2>
            <ul className={styles.tours}>
              {tours.map((tour) => (
                <li key={tour.id}>
                  <Link href={`/tours/${tour.slug}`} className={styles.tourCard}>
                    <span className={styles.thumb}>
                      <Image
                        src={tour.heroImageUrl ?? tour.category.photoUrl}
                        alt=""
                        fill
                        sizes="48px"
                      />
                    </span>
                    <span className={styles.tourText}>
                      <span className={styles.tourTitle}>{tour.title}</span>
                      <span className={styles.tourPrice}>{describeTourPrice(tour)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav aria-label="Footer" className={styles.subnav}>
          <ul className={styles.subnavList}>
            {subnav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href="#" className={styles.top}>
            Back to top <span aria-hidden="true">&uarr;</span>
          </a>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.legalEntity} · All rights reserved
        </p>
      </Container>
    </footer>
  );
}
