import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { TourWithTiers } from "@/lib/content/tours";

export function WhatToExpect({ tour }: { tour: TourWithTiers }) {
  if (!tour.whatToExpectFood && !tour.whatToExpectHistory) return null;

  return (
    <div>
      <Heading level={2}>What to expect</Heading>
      {tour.whatToExpectFood && (
        <div>
          <Heading level={4}>Authentic food tasting experience</Heading>
          <Text>{tour.whatToExpectFood}</Text>
        </div>
      )}
      {tour.whatToExpectHistory && (
        <div>
          <Heading level={4}>Historical and cultural experience</Heading>
          <Text>{tour.whatToExpectHistory}</Text>
        </div>
      )}
    </div>
  );
}
