import { AboutStory } from "@/components/about/AboutStory";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ABOUT_CONTENT } from "@/lib/content/about-contact";

export const metadata = {
  title: "About Us — Bolzano Street Food Tour",
  description: "Meet the local guides behind Bolzano Street Food Tour and learn why we built it.",
};

export default function AboutPage() {
  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="Our story"
          title={ABOUT_CONTENT.heroTitle}
          lead={ABOUT_CONTENT.lead}
          photo={{
            src: "/images/home/mosaic/bolzano-arch-wine.jpg",
            alt: "A stone archway over a cobbled alley in Bolzano's old town, with a cafe table beyond",
          }}
        />
        <AboutStory />
      </Container>
    </Section>
  );
}
