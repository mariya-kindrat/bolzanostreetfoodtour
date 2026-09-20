import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ContactForm } from "@/components/marketing/ContactForm";
import { CONTACT_CONTENT } from "@/lib/content/about-contact";
import { CONTACT_INFO } from "@/lib/content/global";

export const metadata = {
  title: "Contact Us — Bolzano Street Food Tour",
  description: "Get in touch with Bolzano Street Food Tour by form, email, or phone.",
};

export default function ContactPage() {
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>{CONTACT_CONTENT.heroTitle}</Heading>
        <Text>{CONTACT_CONTENT.intro}</Text>
        <Suspense>
          <ContactForm />
        </Suspense>
        <Heading level={2}>Contact details</Heading>
        <Text>{CONTACT_INFO.email}</Text>
        <Text>{CONTACT_INFO.phoneUsTollFree} (from US, toll-free)</Text>
        <Text>{CONTACT_INFO.phoneItaly} (within Italy)</Text>
        <Heading level={2}>Meeting point directions</Heading>
        <Text>{CONTACT_CONTENT.meetingPointDirections}</Text>
      </Container>
    </Section>
  );
}
