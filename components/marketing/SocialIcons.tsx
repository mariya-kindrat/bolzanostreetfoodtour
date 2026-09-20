import type { ReactNode } from "react";
import styles from "@/components/marketing/Footer.module.css";
import { SOCIAL_LINKS, type SocialNetwork } from "@/lib/content/global";

const ICONS: Record<SocialNetwork, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube: (
    <>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
};

/** Round social icons; an icon becomes a link as soon as its href is filled in. */
export function SocialIcons() {
  return (
    <ul className={styles.social} data-testid="footer-social">
      {SOCIAL_LINKS.map(({ network, label, href }) => {
        const icon = (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {ICONS[network]}
          </svg>
        );
        return (
          <li key={network} aria-hidden={href ? undefined : true}>
            {href ? (
              <a href={href} className={styles.socialLink} aria-label={label}>
                {icon}
              </a>
            ) : (
              <span className={styles.socialLink}>{icon}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
