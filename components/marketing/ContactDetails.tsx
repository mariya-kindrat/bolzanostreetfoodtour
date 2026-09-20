import { Heading } from "@/components/ui/Heading";
import { CONTACT_CONTENT } from "@/lib/content/about-contact";
import { CONTACT_INFO, telHref } from "@/lib/content/global";
import styles from "@/components/marketing/ContactDetails.module.css";

export function ContactDetails() {
  return (
    <aside className={styles.card} aria-label="Contact details">
      <Heading level={3} as="h2">
        Contact details
      </Heading>
      <ul className={styles.list}>
        <li>
          <span className={styles.label}>Email</span>
          <a href={`mailto:${CONTACT_INFO.email}`} className={styles.link}>
            {CONTACT_INFO.email}
          </a>
        </li>
        <li>
          <span className={styles.label}>Within Italy</span>
          <a href={telHref(CONTACT_INFO.phoneItaly)} className={styles.link}>
            {CONTACT_INFO.phoneItaly}
          </a>
        </li>
        <li>
          <span className={styles.label}>From the US, toll-free</span>
          <a href={telHref(CONTACT_INFO.phoneUsTollFree, "+1")} className={styles.link}>
            {CONTACT_INFO.phoneUsTollFree}
          </a>
        </li>
      </ul>
      <p className={styles.note}>{CONTACT_CONTENT.languages}</p>
    </aside>
  );
}
