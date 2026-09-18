import { Button } from "@/components/ui/Button";
import { LabelChip } from "@/components/ui/LabelChip";
import { Kicker } from "@/components/ui/Kicker";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { COLORS, TYPE_SCALE, RADIUS, SHADOW } from "@/components/ui/tokens";
import { StyleGuideInputDemo } from "@/app/style-guide/StyleGuideInputDemo";

export const metadata = { robots: { index: false, follow: false } };

const SWATCHES = Object.entries(COLORS);

export default function StyleGuidePage() {
  return (
    <Container>
      <Heading level={1}>Alpine Editorial style guide</Heading>
      <Section tone="white">
        <Heading level={2}>Colors</Heading>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {SWATCHES.map(([name, value]) => (
            <div key={name}>
              <div style={{ width: 80, height: 80, background: value, borderRadius: 8 }} />
              <Text size="sm">{name}</Text>
            </div>
          ))}
          <div>
            <div
              data-testid="forest-dark-swatch"
              style={{ width: 80, height: 80, background: "var(--color-forest-dark)", borderRadius: 8 }}
            />
            <Text size="sm">forest-dark</Text>
          </div>
        </div>
      </Section>
      <Section tone="cream">
        <Heading level={2}>Typography</Heading>
        <Kicker>Bozen · Bolzano — Altstadt</Kicker>
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Text>Body text in Inter, set on the Alpine Editorial cream background.</Text>
      </Section>
      <Section tone="cream">
        <Heading level={2}>Type scale</Heading>
        {Object.entries(TYPE_SCALE).map(([name, value]) => (
          <p key={name} style={{ fontFamily: "var(--font-serif)", fontSize: value }}>
            {name} — {value}
          </p>
        ))}
      </Section>
      <Section tone="white">
        <Heading level={2}>Shape & shadow</Heading>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {Object.entries(SHADOW).map(([name, value]) => (
            <div
              key={name}
              style={{
                width: 80,
                height: 80,
                background: "var(--color-cream)",
                borderRadius: RADIUS.chip,
                boxShadow: value,
              }}
            />
          ))}
        </div>
      </Section>
      <Section tone="white">
        <Heading level={2}>Buttons</Heading>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button href="#" variant="primary">
            Primary button
          </Button>
          <Button href="#" variant="secondary">
            Secondary button
          </Button>
          <Button href="#" variant="ghost">
            Ghost button
          </Button>
        </div>
      </Section>
      <Section tone="cream">
        <Heading level={2}>Label chip</Heading>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ position: "relative", width: 160, height: 90, background: "#fff" }}>
            <LabelChip number="01" label="€49" corner="top-right" />
          </div>
          <div style={{ position: "relative", width: 160, height: 90, background: "#fff" }}>
            <LabelChip number="02" label="Caldaro" corner="bottom-left" />
          </div>
        </div>
      </Section>
      <Section tone="white">
        <Heading level={2}>Input</Heading>
        <StyleGuideInputDemo />
      </Section>
      <Section tone="forest-dark">
        <Container>
          <div data-testid="forest-dark-section-demo">
            <Text onDark>This is a Section with tone=&quot;forest-dark&quot;.</Text>
          </div>
        </Container>
      </Section>
    </Container>
  );
}
