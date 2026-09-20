import { db } from "@/lib/db";

export function getTransferRoutes() {
  return db.transferRoute.findMany({
    where: { isActive: true },
    include: { supplements: true },
    orderBy: [{ origin: "asc" }, { id: "asc" }],
  });
}

export const TRANSFERS_CONTENT = {
  facts: [
    { label: "Passengers", value: "Up to 7, with luggage" },
    { label: "Book ahead", value: "At least 72 hours" },
    { label: "Fees", value: "All fees included" },
    { label: "Vehicle", value: "AC luxury minivan" },
  ],
  intro: [
    "Enjoy the comfort of your AC private transfer in your deluxe vehicle from your arrival airport to your hotel in Bolzano and vice versa.",
    "Professional and experienced drivers with private chauffeur license. Private transfer up to 7 people with luggage.",
    "Your accommodation is not in Bolzano city? Not a problem — we will transfer you everywhere in South Tyrol.",
  ],
  restriction:
    "All transfer services are strictly reserved to Bolzano Street Food Tours clients who book our tours and " +
    "experiences. All transfer services must be booked at least 72 hrs prior to pickup.",
  included: [
    "Professional Driver with basic English knowledge",
    "AC Private luxury Minivan with panoramic roof, leather seats and automatic doors up to 7 passengers with luggage",
    "All fees included",
    "Sign bearing passenger's name",
  ],
  airportWhatToExpect:
    "After going through customs and baggage claim, outside Arrivals you will meet your private driver holding a " +
    "sign with your name, then be transferred to your hotel in Bolzano. In case of baggage/flight delay or " +
    "difficulty locating the driver, contact the driver at the number on your voucher before making alternative " +
    "arrangements.",
  hotelWhatToExpect:
    "Your private driver will meet you at the hotel lobby. Please be ready at least 10 minutes before your " +
    "scheduled pickup.",
  notIncluded: [
    "20% Night supplement (9pm–7am)",
    "20% Bank Holiday supplement (Christmas, New Year's, Easter)",
    "Every extra hour of delay: +€35",
    "Porterage",
    "Tips",
  ],
  groupTransfers:
    "Arriving with a group of more than 7 passengers? We work closely with professional reliable coach companies " +
    "located in all major airport arrival cities in North-East Italy. Send passenger count + arrival " +
    "airport/pickup address for a proposal. Also offer Meet & Greet Service / English-speaking Assistant.",
  withinSouthTyrol:
    "We provide all kinds of private transfers within South Tyrol via our wide network of professional, reliable " +
    "local private drivers.",
  cancellationPolicy:
    "If you cancel up to 72 hours prior to arrival/departure, no cancellation fee. If you cancel less than 72 " +
    "hours prior, 100% cancellation fee. No-show = full penalty.",
};
