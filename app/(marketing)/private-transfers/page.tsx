import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { RatesTable } from "@/components/transfers/RatesTable";
import { SupplementsTable } from "@/components/transfers/SupplementsTable";
import { getTransferRoutes, TRANSFERS_CONTENT } from "@/lib/content/transfers";

export const metadata = {
  title: "Private Airport Transfers — Bolzano & South Tyrol",
  description:
    "Private, luxury AC minivan transfers between Milan, Venice, Verona, Bergamo, Munich, or Innsbruck airports and Bolzano.",
};

export const revalidate = 3600;

export default async function PrivateTransfersPage() {
  const routes = await getTransferRoutes();
  const supplements = routes[0]?.supplements ?? [];

  return (
    <Section tone="white">
      <Container>
        <Heading level={1}>Private Transfers</Heading>
        {TRANSFERS_CONTENT.intro.map((p) => (
          <Text key={p}>{p}</Text>
        ))}
        <Text>
          <strong>Please note:</strong> {TRANSFERS_CONTENT.restriction}
        </Text>

        <Heading level={2}>Airport transfers — what to expect</Heading>
        <Text>{TRANSFERS_CONTENT.airportWhatToExpect}</Text>

        <Heading level={2}>Hotel transfers — what to expect</Heading>
        <Text>{TRANSFERS_CONTENT.hotelWhatToExpect}</Text>

        <div className="table-scroll" tabIndex={0} role="group" aria-label="Airport rates">
          <RatesTable routes={routes} />
        </div>
        <div className="table-scroll" tabIndex={0} role="group" aria-label="Supplements">
          <SupplementsTable supplements={supplements} />
        </div>

        <Heading level={2}>What&apos;s included</Heading>
        <Text>{TRANSFERS_CONTENT.included}</Text>

        <Heading level={2}>Not included</Heading>
        <ul>
          {TRANSFERS_CONTENT.notIncluded.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Heading level={2}>Group transfers</Heading>
        <Text>{TRANSFERS_CONTENT.groupTransfers}</Text>

        <Heading level={2}>Transfers within South Tyrol</Heading>
        <Text>{TRANSFERS_CONTENT.withinSouthTyrol}</Text>

        <Heading level={2}>Cancellation policy</Heading>
        <Text>{TRANSFERS_CONTENT.cancellationPolicy}</Text>

        <Link href="/contact">Ready to book? Contact us</Link>
      </Container>
    </Section>
  );
}
