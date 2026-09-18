import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { describeTourPrice } from "@/lib/content/pricing-display";
import type { TourWithTiers } from "@/lib/content/tours";

export function TourHero({ tour }: { tour: TourWithTiers }) {
  return (
    <div
      style={{ position: "relative", minHeight: "50vh", display: "flex", alignItems: "flex-end" }}
    >
      <Image
        src={tour.heroImageUrl ?? "/images/tours/default-hero.jpg"}
        alt={tour.title}
        fill
        priority
        style={{ objectFit: "cover", zIndex: -1 }}
      />
      {/* Darkens the bottom of whatever photo sits behind the headline, so
          contrast never depends on the photo itself being light. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 60%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: "2rem" }}>
        <Heading level={1} as="h1" onDark>
          {tour.title}
        </Heading>
        {tour.daysOffered && (
          <Text size="lg" onDark>
            {tour.daysOffered}
          </Text>
        )}
        <Text size="lg" onDark>
          {describeTourPrice(tour)}
        </Text>
        {tour.tourType && (
          <Text size="sm" onDark>
            {tour.tourType}
          </Text>
        )}
      </div>
    </div>
  );
}
