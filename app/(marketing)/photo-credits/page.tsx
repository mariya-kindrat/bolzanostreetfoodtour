import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { PHOTO_CREDITS } from "@/lib/content/photo-credits";

export const metadata = {
  title: "Photo Credits — Bolzano Street Food Tour",
  description: "Attribution for photography used on this site, as required by its license.",
};

export default function PhotoCreditsPage() {
  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Photo Credits</Heading>
        <Text>
          Photography on this site is sourced from Wikimedia Commons under Creative Commons licenses
          that require attribution. Credits for each image are listed below.
        </Text>
        <ul>
          {PHOTO_CREDITS.map((credit) => (
            <li key={credit.filename}>
              <Text>
                &ldquo;{credit.commonsTitle}&rdquo; by {credit.author}, licensed under{" "}
                <a href={credit.licenseUrl}>{credit.license}</a>, via{" "}
                <a href={credit.sourceUrl}>Wikimedia Commons</a>.
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
