import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";

export function ProductCard({ tour }: { tour: TourWithTiers }) {
  // Quote-only winter tours link to their own detail page like every other
  // category; that page carries the quote-only notice and its /contact CTA.
  const href = `/tours/${tour.slug}`;

  return (
    <article
      style={{
        border: "1px solid var(--color-cream-dark)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", height: 200 }}>
        <Image
          src={tour.heroImageUrl ?? "/images/tours/default-hero.jpg"}
          alt={tour.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "1rem" }}>
        <Reveal>
          <Heading level={3}>{tour.title}</Heading>
          <Text size="sm">{describeTourPrice(tour)}</Text>
          {tour.validityLabel && <Text size="sm">{tour.validityLabel}</Text>}
          {tour.daysOffered && <Text size="sm">{tour.daysOffered}</Text>}
          {tour.durationLabel && <Text size="sm">{tour.durationLabel}</Text>}
          <ul>
            {tour.highlights.slice(0, 3).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <Link href={href}>More details</Link>
        </Reveal>
      </div>
    </article>
  );
}
