import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import styles from "@/components/catalog/CatalogHeader.module.css";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  photo?: { src: string; alt: string };
};

/** Photo band with overlaid text when a photo is given, plain text otherwise. */
export function CatalogHeader({ eyebrow, title, lead, photo }: Props) {
  if (!photo) {
    return (
      <div className={styles.plain}>
        <Kicker>{eyebrow}</Kicker>
        <Heading level={1}>{title}</Heading>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    );
  }
  return (
    <div className={styles.band}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority
        sizes="(max-width: 1152px) 100vw, 1152px"
      />
      <div aria-hidden="true" className={styles.scrim} />
      <div className={styles.text}>
        <Kicker onDark>{eyebrow}</Kicker>
        <Heading level={1} onDark>
          {title}
        </Heading>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </div>
  );
}
