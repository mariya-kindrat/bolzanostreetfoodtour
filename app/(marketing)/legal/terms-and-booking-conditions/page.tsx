import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { LEGAL_REVIEW_NOTICE, TERMS_SECTIONS } from "@/lib/content/legal";

export const metadata = { title: "Terms & Booking Conditions — Bolzano Street Food Tour" };

export default function TermsPage() {
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Terms & Booking Conditions</Heading>
        <Text size="sm" muted>
          {LEGAL_REVIEW_NOTICE}
        </Text>
        {TERMS_SECTIONS.map((s) => (
          <div key={s.heading}>
            <Heading level={2}>{s.heading}</Heading>
            <Text>{s.body}</Text>
          </div>
        ))}
      </Container>
    </Section>
  );
}
