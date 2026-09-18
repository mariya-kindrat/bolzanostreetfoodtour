import type { Tile } from "@/types/homepage";

export const HOMEPAGE_CONTENT = {
  heroTagline: "Discover, explore Italy's hidden gem — a tasting at a time",
  whySection: {
    heading: "Amazing Food, Culture & History!",
    body:
      "There are many ways to describe Bolzano, but the way we like the most is with your " +
      "five senses! During this walk you will have the chance to see, hear, taste, touch and " +
      "smell the history and culture of the most intriguing Northern Italian city through its " +
      "diverse and unique gastronomical tradition; a mix of Mediterranean and Austrian " +
      "culinary background found nowhere else.",
  },
  toursIntro:
    "Private food tours for groups, Wine Tours, Cooking classes from the top of the " +
    "Dolomites to the Wine Road, seasonal food related excursions everywhere in South Tyrol " +
    "and much more!",
  gatewaySection: {
    heading: "A market, a menu, a mix of two cultures",
    body:
      "Bolzano's Piazza Erbe market has traded fruit, cheese, and speck since the Middle " +
      "Ages, at the crossroads of Italian and Austrian food traditions. Every tour starts " +
      "here — among the stalls, not on a mountainside.",
  },
  whereIsItSection: {
    heading: "Where is it?",
    body:
      "Bolzano is the capital city of South Tyrol (Alto Adige or Suedtirol), a bilingual " +
      "region in northeastern Italy bordering Austria and close to Trentino — with the " +
      "Dolomites as its backdrop. Need private transportation to and from Bolzano and " +
      "South Tyrol? Check our Transfers page for rates and services.",
  },
  testimonials: [
    {
      quote:
        "Thank you Claudia for a spectacular tour with the ladies. We enjoyed it tremendously. " +
        "Several of the ladies said it was the 'best tour ever'! Thank you again.",
      author: "Patricia R.",
      origin: "USA",
      date: "10 Oct 2018",
    },
    // The three below are placeholder quotes until reviews are mapped from
    // real customer comments.
    {
      quote:
        "The best way to meet Bolzano. Every stop was a new taste, and our guide knew " +
        "the story behind each one.",
      author: "Daniel M.",
      origin: "Canada",
      date: "14 May 2024",
    },
    {
      quote:
        "We came for the wine and stayed for the strudel. A relaxed, delicious afternoon " +
        "we will remember for years.",
      author: "Sophie L.",
      origin: "UK",
      date: "2 Sep 2024",
    },
    {
      quote:
        "Small group, big flavours. Worth every minute, and we booked a cooking class " +
        "for the next day.",
      author: "Marco T.",
      origin: "Australia",
      date: "21 Jun 2025",
    },
  ],
  tiles: [
    {
      title: "Bolzano Street Food Tour®",
      href: "/tours/bolzano-street-food-tour",
      category: "food",
      image: "/images/home/tile-street-food.jpg",
    },
    {
      title: "Wine Tours",
      href: "/wine-tours",
      category: "wine",
      image: "/images/home/tile-wine-tours.jpg",
    },
    {
      title: "Cooking Classes",
      href: "/cooking-classes",
      category: "cooking",
      image: "/images/home/tile-cooking-classes.jpg",
    },
    {
      title: "Winter Tours",
      href: "/winter-tours",
      category: "winter",
      image: "/images/home/tile-winter-tours.jpg",
    },
    { title: "Trento Street Food Tour", href: "/tours/trento-street-food-tour", category: "food" },
    { title: "Bolzano SFT & Christmas Markets", href: "/tours/christmas-markets", category: "winter" },
  ] satisfies Tile[],
};
