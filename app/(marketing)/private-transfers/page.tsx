import { Container } from "@/components/ui/Container";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { Section } from "@/components/ui/Section";
import { TransferDetails } from "@/components/transfers/TransferDetails";
import { TransferIntro } from "@/components/transfers/TransferIntro";
import { RatesTable } from "@/components/transfers/RatesTable";
import { SupplementsTable } from "@/components/transfers/SupplementsTable";
import tables from "@/components/transfers/TransferTables.module.css";
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
        <CatalogHeader
          eyebrow="Bolzano & South Tyrol"
          title="Private Transfers"
          lead={TRANSFERS_CONTENT.intro[0]}
          photo={{
            src: "/images/home/hero-dolomites.jpg",
            alt: "The Tre Cime di Lavaredo rising out of clouds in the Dolomites",
          }}
        />
        <TransferIntro />

        <div
          className={`table-scroll ${tables.wrap}`}
          tabIndex={0}
          role="group"
          aria-label="Airport rates"
        >
          <RatesTable routes={routes} />
        </div>
        <div
          className={`table-scroll ${tables.wrap}`}
          tabIndex={0}
          role="group"
          aria-label="Supplements"
        >
          <SupplementsTable supplements={supplements} />
        </div>

        <TransferDetails />
      </Container>
    </Section>
  );
}
