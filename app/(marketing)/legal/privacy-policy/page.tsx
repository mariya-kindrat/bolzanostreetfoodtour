import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { CONTACT_INFO } from "@/lib/content/global";
import { LEGAL_REVIEW_NOTICE, PRIVACY_POLICY_SECTIONS } from "@/lib/content/legal";

export const metadata = { title: "Privacy Policy — Bolzano Street Food Tour" };

export default function PrivacyPolicyPage() {
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Privacy Policy</Heading>
        <Text size="sm" muted>
          {LEGAL_REVIEW_NOTICE}
        </Text>
        {PRIVACY_POLICY_SECTIONS.map((s) => (
          <div key={s.heading}>
            <Heading level={2}>{s.heading}</Heading>
            <Text>{s.body}</Text>
          </div>
        ))}
        <Heading level={2}>Contact</Heading>
        <Text>Questions about this policy? Email {CONTACT_INFO.email}.</Text>
      </Container>
    </Section>
  );
}
