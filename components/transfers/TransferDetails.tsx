import Link from "next/link";
import { contactHref } from "@/components/tour/BookingCta";
import { Heading } from "@/components/ui/Heading";
import { TRANSFERS_CONTENT } from "@/lib/content/transfers";
import styles from "@/components/transfers/TransferDetails.module.css";

const { included, notIncluded, groupTransfers, withinSouthTyrol, cancellationPolicy } =
  TRANSFERS_CONTENT;

/** Everything after the rate tables, ending with the contact call to action. */
export function TransferDetails() {
  return (
    <>
      <div className={styles.two}>
        <section>
          <Heading level={2}>What&apos;s included</Heading>
          <ul className={`${styles.list} ${styles.yes}`}>
            {included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <Heading level={2}>Not included</Heading>
          <ul className={`${styles.list} ${styles.no}`}>
            {notIncluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className={styles.two}>
        <section className={styles.card}>
          <Heading level={3} as="h2">
            Group transfers
          </Heading>
          <p>{groupTransfers}</p>
        </section>
        <section className={styles.card}>
          <Heading level={3} as="h2">
            Transfers within South Tyrol
          </Heading>
          <p>{withinSouthTyrol}</p>
        </section>
      </div>
      <section className={styles.policy}>
        <Heading level={3} as="h2">
          Cancellation policy
        </Heading>
        <p>{cancellationPolicy}</p>
      </section>
      <section className={styles.cta}>
        <Heading level={2} onDark>
          Ready to book?
        </Heading>
        <p>Tell us your route, date and passenger count and we will confirm your transfer.</p>
        <Link href={contactHref("Private transfer")} className={styles.button}>
          Contact us
        </Link>
      </section>
    </>
  );
}
