import { Suspense } from "react";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { ContactDetails } from "@/components/marketing/ContactDetails";
import { ContactForm } from "@/components/marketing/ContactForm";
import layout from "@/components/marketing/ContactLayout.module.css";
import { MeetingPoint } from "@/components/marketing/MeetingPoint";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CONTACT_CONTENT } from "@/lib/content/about-contact";

export const metadata = {
  title: "Contact Us — Bolzano Street Food Tour",
  description: "Get in touch with Bolzano Street Food Tour by form, email, or phone.",
};

export default function ContactPage() {
  return (
    <Section tone="white">
      <Container>
        <CatalogHeader
          eyebrow="Get in touch"
          title={CONTACT_CONTENT.heroTitle}
          lead={CONTACT_CONTENT.intro}
          photo={{
            src: "/images/home/mosaic/vineyard-village.jpg",
            alt: "Vineyards in Schenna with a mountain panorama",
          }}
        />
        <div className={layout.grid}>
          <Suspense>
            <ContactForm />
          </Suspense>
          <ContactDetails />
        </div>
        <MeetingPoint />
      </Container>
    </Section>
  );
}
