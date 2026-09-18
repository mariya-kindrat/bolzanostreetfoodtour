import type { Category } from "@/lib/generated/prisma/client";

export const CONTACT_INFO = {
  email: "info@bolzanostreetfoodtour.com",
  phoneItaly: "+39 366 227 6538",
  phoneUsTollFree: "(800) 771-7756",
};

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
  // Which side of the header's centered wordmark this item renders on.
  // Undefined for items (like Home) that only appear in the footer's full
  // list, not in the header — the header's brand mark is the home link.
  section?: "left" | "right";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Tours",
    href: "/categories",
    section: "left",
    // Dropdown children are the live categories, appended by
    // withCategoryLinks() at render time so the nav can't drift out of
    // sync with the admin-managed Category table.
  },
  { label: "Transfers", href: "/private-transfers", section: "left" },
  { label: "About", href: "/about", section: "right" },
  { label: "Blog", href: "/blog", section: "right" },
  { label: "Contact", href: "/contact", section: "right" },
];

// Sets the "Tours" nav item's dropdown children to the live active
// categories.
export function withCategoryLinks(items: NavItem[], categories: Category[]): NavItem[] {
  const children = categories.map((category) => ({
    label: category.name,
    href: `/${category.slug}`,
  }));
  return items.map((item) => (item.label === "Tours" ? { ...item, children } : item));
}

export const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Booking Conditions", href: "/legal/terms-and-booking-conditions" },
  { label: "Photo Credits", href: "/photo-credits" },
];

export const TRUST_POINTS = [
  "The ONLY Street Food Tour of Bolzano",
  "Secure bookings",
  "English speaking licensed Local guides",
  "Guaranteed Departures with min 2 passengers, max 12 in our semi-private tours",
  "Exclusive private tours and excursions offered also in Russian, German, French and Dutch",
];

export const STANDARD_CANCELLATION_POLICY =
  "If you cancel at least 7 day(s) in advance of the scheduled departure, there is no " +
  "cancellation fee. If you cancel between 3 and 6 day(s) in advance of the scheduled " +
  "departure, there is a 50 percent cancellation fee. If you cancel within 2 day(s) of the " +
  "scheduled departure, there is a 100 percent cancellation fee.";

export const BRAND = {
  name: "Bolzano Street Food Tour",
  tagline: "Discover, explore Italy's hidden gem — a tasting at a time",
  legalEntity: "Italy Destination Services LLC",
};
