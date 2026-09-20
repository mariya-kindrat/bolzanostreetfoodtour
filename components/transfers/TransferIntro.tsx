import { FactsStrip } from "@/components/ui/FactsStrip";
import { Heading } from "@/components/ui/Heading";
import { TRANSFERS_CONTENT } from "@/lib/content/transfers";
import styles from "@/components/transfers/TransferIntro.module.css";

const { facts, restriction, intro, airportWhatToExpect, hotelWhatToExpect } = TRANSFERS_CONTENT;

/** Everything between the page header and the rate tables. */
export function TransferIntro() {
  return (
    <>
      <div className={styles.strip}>
        <FactsStrip facts={facts} />
      </div>
      <p className={styles.notice}>
        <strong>Please note:</strong> {restriction}
      </p>
      <div className={styles.intro}>
        {intro.slice(1).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className={styles.cards}>
        <section className={styles.card}>
          <Heading level={3} as="h2">
            Airport transfers — what to expect
          </Heading>
          <p>{airportWhatToExpect}</p>
        </section>
        <section className={styles.card}>
          <Heading level={3} as="h2">
            Hotel transfers — what to expect
          </Heading>
          <p>{hotelWhatToExpect}</p>
        </section>
      </div>
    </>
  );
}
