import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ABOUT_CONTENT } from "@/lib/content/about-contact";

export const metadata = {
  title: "About Us — Bolzano Street Food Tour",
  description: "Meet the local guides behind Bolzano Street Food Tour and learn why we built it.",
};

export default function AboutPage() {
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>{ABOUT_CONTENT.heroTitle}</Heading>
        <Text>{ABOUT_CONTENT.body}</Text>
      </Container>
    </Section>
  );
}
