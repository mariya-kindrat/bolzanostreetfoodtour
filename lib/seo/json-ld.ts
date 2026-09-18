import { CONTACT_INFO } from "@/lib/content/global";
import type { Tour } from "@/lib/generated/prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildTouristTripJsonLd(tour: Pick<Tour, "title" | "description" | "slug">) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.description,
    url: `${SITE_URL}/tours/${tour.slug}`,
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Bolzano Street Food Tour",
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phoneItaly,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bolzano",
      addressCountry: "IT",
    },
  };
}
