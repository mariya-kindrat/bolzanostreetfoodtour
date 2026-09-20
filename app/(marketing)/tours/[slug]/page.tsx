import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CancellationPolicy } from "@/components/tour/CancellationPolicy";
import { HighlightsList } from "@/components/tour/HighlightsList";
import { ImportantInfo } from "@/components/tour/ImportantInfo";
import { QuickFacts } from "@/components/tour/QuickFacts";
import { QuoteOnlyNotice } from "@/components/tour/QuoteOnlyNotice";
import { BookingWidgetComingSoon } from "@/components/tour/BookingWidgetComingSoon";
import { TourHero } from "@/components/tour/TourHero";
import { WhatToExpect } from "@/components/tour/WhatToExpect";
import { StructuredData } from "@/components/seo/StructuredData";
import { getAllTourSlugs, getTourBySlug } from "@/lib/content/tours";
import { buildTouristTripJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour not found" };
  return {
    title: `${tour.title} — Bolzano Street Food Tour`,
    description: tour.description.slice(0, 155),
  };
}

export default async function TourDetailPage({ params }: PageProps<"/tours/[slug]">) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const isQuoteOnly = !tour.category.isBookable;

  return (
    <>
      <StructuredData data={buildTouristTripJsonLd(tour)} />
      <TourHero tour={tour} />
      <QuickFacts tour={tour} />
      <Section tone="white">
        <Container>
          <div className="detail-grid">
            <div>
              <p>{tour.description}</p>
              <HighlightsList highlights={tour.highlights} />
              <ImportantInfo tour={tour} />
              <WhatToExpect tour={tour} />
              {!isQuoteOnly && <CancellationPolicy />}
            </div>
            <div>
              {isQuoteOnly ? (
                <QuoteOnlyNotice tour={tour} />
              ) : (
                <BookingWidgetComingSoon tour={tour} />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
