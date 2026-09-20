import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { CONTACT_CONTENT } from "@/lib/content/about-contact";
import styles from "@/components/marketing/MeetingPoint.module.css";

export function MeetingPoint() {
  return (
    <section className={styles.layout}>
      <div className={styles.photo}>
        <Image
          src="/images/home/mosaic/bolzano-arcade-street.jpg"
          alt="Pastel arcaded buildings along a cobbled street in Bolzano's old town"
          fill
          sizes="(max-width: 860px) 90vw, 45vw"
        />
      </div>
      <div className={styles.text}>
        <Kicker>Find us</Kicker>
        <Heading level={2}>Meeting point directions</Heading>
        <p>{CONTACT_CONTENT.meetingPointDirections}</p>
      </div>
    </section>
  );
}
