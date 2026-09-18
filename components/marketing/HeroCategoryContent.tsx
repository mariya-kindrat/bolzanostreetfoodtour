"use client";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { useHeroSlideIndex } from "@/components/hooks/useHeroSlideIndex";
import type { Category } from "@/lib/generated/prisma/client";

export function HeroCategoryContent({ categories }: { categories: Category[] }) {
  const activeIndex = useHeroSlideIndex(categories.length);
  const active = categories[activeIndex] ?? categories[0];
  if (!active) return null;

  return (
    <>
      <Heading level={1} as="h1" onDark>
        {active.name}
      </Heading>
      <Text size="lg" onDark>
        {active.description}
      </Text>
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
        <Button href={`/${active.slug}`} variant="primary">
          Explore {active.name}
        </Button>
      </div>
    </>
  );
}
