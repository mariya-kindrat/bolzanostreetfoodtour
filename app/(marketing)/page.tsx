import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Kicker } from "@/components/ui/Kicker";
import { LabelChip } from "@/components/ui/LabelChip";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/marketing/Hero";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { WhySection } from "@/components/marketing/WhySection";
import { TourCard } from "@/components/marketing/TourCard";
import { TourCarousel } from "@/components/marketing/TourCarousel";
import { TrustBlock } from "@/components/marketing/TrustBlock";
import { StructuredData } from "@/components/seo/StructuredData";
import { HOMEPAGE_CONTENT } from "@/lib/content/homepage";
import { getActiveCategories } from "@/lib/content/categories";
import { getAllActiveTours } from "@/lib/content/tours";
import { buildLocalBusinessJsonLd } from "@/lib/seo/json-ld";

export const metadata = {
  title: "Bolzano Street Food Tour — Food, Wine & Culture Tours in South Tyrol",
  description:
    "Award-winning street food, wine, and cooking-class tours in Bolzano and South Tyrol. Instant online booking, small groups, licensed local guides.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, tours] = await Promise.all([getActiveCategories(), getAllActiveTours()]);
  return (
    <>
      <StructuredData data={buildLocalBusinessJsonLd()} />
      <Hero categories={categories} testimonials={HOMEPAGE_CONTENT.testimonials} />
      <Section tone="cream">
        <Container>
          <Reveal>
            <WhySection />
          </Reveal>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto", marginBottom: "var(--space-7)" }}>
              <Kicker>{HOMEPAGE_CONTENT.toursEyebrow}</Kicker>
              <Heading level={2}>Discover our tours</Heading>
              <Text muted>{HOMEPAGE_CONTENT.toursIntro}</Text>
            </div>
            {tours.length > 0 && (
              <div id="discover-our-tours">
                <TourCarousel>
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </TourCarousel>
              </div>
            )}
          </Reveal>
        </Container>
      </Section>
      <Section tone="forest-dark">
        <Container>
          <Reveal>
            <div data-testid="wine-accent-panel" style={{ display: "flex", alignItems: "center", gap: "1.5rem", position: "relative" }}>
              <div style={{ position: "relative", width: 80, height: 60 }}>
                <LabelChip number="02" label="Caldaro" corner="top-right" />
              </div>
              <div>
                <Heading level={3} onDark>
                  Wine Tours
                </Heading>
                <Text onDark muted>
                  Kaltern · Tramin · Gewürztraminer — an afternoon among the vines, ending in
                  the cellar.
                </Text>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section tone="cream">
        <Container>
          <Reveal>
            <Heading level={2}>{HOMEPAGE_CONTENT.gatewaySection.heading}</Heading>
            <Text>{HOMEPAGE_CONTENT.gatewaySection.body}</Text>
          </Reveal>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <Reveal>
            <Heading level={2}>{HOMEPAGE_CONTENT.whereIsItSection.heading}</Heading>
            <Text>{HOMEPAGE_CONTENT.whereIsItSection.body}</Text>
          </Reveal>
        </Container>
      </Section>
      <Section tone="forest">
        <Container>
          <Reveal>
            <TrustBlock />
          </Reveal>
        </Container>
      </Section>
      <Section tone="cream">
        <Container>
          <Reveal>
            <NewsletterForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
