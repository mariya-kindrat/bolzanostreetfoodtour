import { PrismaClient, PriceTierType } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { firstSentence } from "../lib/content/format";

// Run standalone via `tsx prisma/seed.ts` (npm run db:seed), not through the
// Prisma CLI, so prisma.config.ts's own dotenv loading never runs — load
// .env.local here too, same as prisma.config.ts.
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// The cancellation policy's display text is NOT stored per-row here — it's
// identical across every bookable tour, so it lives once in
// lib/content/global.ts (STANDARD_CANCELLATION_POLICY, introduced in Task 3).
// The Tour Detail template (Task 4) decides whether to render it from
// tour.category.isBookable (every category except Winter Tours, which is
// quote-only and never goes through checkout) — no per-row field is seeded
// for this.

const DIETARY_STANDARD =
  "We are not able to accommodate any vegan, gluten-free or dairy substitutions requests, " +
  "however we can offer vegetarian options if advised well in advance. Please contact us at " +
  "info@bolzanostreetfoodtour.com";

const DIETARY_COOKING_CLASS =
  "Can accommodate vegetarian, gluten-free, dairy-free requests if advised in advance.";
const DIETARY_HIKE = "Cannot offer dairy-free, gluten-free or vegan options.";
const DIETARY_18PLUS_STANDARD = `For those 18+ with valid ID. ${DIETARY_STANDARD}`;

// The 4 categories that replace the old TourCategory enum (migration
// 20260918140000_add_category_model) — this array is the reseedable source
// of truth; the migration's INSERT only ran once, historically, to backfill
// existing rows. Photos are the same per-category hero images sourced for
// Task 4 (one representative photo per category, not 21 unique ones) —
// admin-editable placeholders until real per-tour/per-category photography
// is uploaded (see the project_hero-flagship-tour-photos memory).
interface CategorySeed {
  slug: string;
  name: string;
  description: string;
  photoUrl: string;
  altText: string;
  sortOrder: number;
  isBookable?: boolean;
}

const CATEGORIES: CategorySeed[] = [
  {
    slug: "street-food-tours",
    name: "Street Food Tours",
    description:
      "Walking tours through Bolzano's historic center, tasting local specialties stop by stop — a mix of Mediterranean and Austrian cuisine with centuries of history along the way.",
    photoUrl: "/images/tours/street-food-hero.jpg",
    altText:
      "A bustling market street in Bolzano's old town, with food stalls, fruit stands, and the frescoed Casa al Torchio building",
    sortOrder: 0,
  },
  {
    slug: "cooking-classes",
    name: "Cooking Classes",
    description:
      "Learn centuries-old South Tyrolean recipes from local chefs — in a farmhouse on the Ritten plateau, at a winery on the Wine Road, or after a Dolomites hike.",
    photoUrl: "/images/tours/cooking-class-hero.jpg",
    altText:
      "The Ritten plateau's earth pyramids and green farmland above Bolzano, with the Dolomites in the distance",
    sortOrder: 1,
  },
  {
    slug: "wine-tours",
    name: "Wine Tours",
    description:
      "From full-day Wine Road excursions to a rooftop aperitivo walk or a craft-beer evening — discover South Tyrol's indigenous wines and 1,000-year-old beer tradition.",
    photoUrl: "/images/tours/wine-tour-hero.jpg",
    altText: "Dark grape clusters hanging in a South Tyrol vineyard row",
    sortOrder: 2,
  },
  {
    slug: "winter-tours",
    name: "Winter Tours",
    description:
      "Custom, quote-only winter excursions across South Tyrol — Christmas markets, husky sledding, and snowshoeing, every tour tailored to your group.",
    photoUrl: "/images/tours/winter-tour-hero.jpg",
    altText:
      "A lit Christmas market stall at night in Bolzano, with ornaments for sale beneath a statue on a column",
    sortOrder: 3,
    isBookable: false,
  },
];

const MEETING_WALTHER =
  "Piazza Walther – Walther Square, 39100 Bolzano (guide waits under the statue)";
const MEETING_CAFE_MOZART = "In front of Cafè Mozart, Via J. Perathoner 1, 39100 Bolzano";

interface TourSeed {
  slug: string;
  title: string;
  categorySlug: string;
  description: string;
  heroImageUrl?: string;
  tourType?: string;
  groupSizeLabel?: string;
  language?: string;
  daysOffered?: string;
  startingTime?: string;
  durationLabel?: string;
  meetingPoint?: string;
  highlights?: string[];
  whatsIncluded?: string;
  whatsNotIncluded?: string;
  whatToWear?: string;
  weatherPolicy?: string;
  dietaryInfo?: string;
  whatToExpectFood?: string;
  whatToExpectHistory?: string;
  whoShouldTakeIt?: string;
  priceIsFrom?: boolean;
  priceOnRequest?: boolean;
  validityLabel?: string;
  adultCents?: number;
  childCents?: number;
}

// Whether the Tour Detail template (Task 4) renders the standard
// cancellation policy is NOT a seeded field — it's derived from
// `tour.category.isBookable` (every category except Winter Tours, which is
// quote-only and never goes through checkout).

const TOURS: TourSeed[] = [
  {
    slug: "bolzano-street-food-tour",
    title: "Bolzano Street Food Tour®",
    categorySlug: "street-food-tours",
    description:
      "Taste the traditional food of Bolzano, the Gateway to the Dolomites, with this walking tour. Visit food stalls and sample street food through the historical center. A local guide leads the way to see the Medieval arches, the Market Square and one of the oldest taverns in town.",
    tourType: "Semi-Private",
    groupSizeLabel: "Min 2 Max 10",
    language: "English",
    daysOffered: "Mon–Sat",
    startingTime: "10:00 am (Sat 2:00 pm)",
    durationLabel: "2.5 hrs",
    meetingPoint: MEETING_WALTHER,
    highlights: [
      "Discover Bolzano's unique culinary tradition, a mix of Mediterranean and Austrian cuisine",
      "Taste different types of food and local beers and drinks",
      "Explore a hidden gem and learn the controversial historical background of Bolzano",
      "Activity limited to min 2 / max 12 for a personal, exclusive experience",
    ],
    whatsIncluded: "English speaking tour guide; All food tastings",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_STANDARD,
    whatToExpectFood:
      "5 stops sampling authentic local delicacies at popular locals-only spots. Tastings may include the best sausage in town, local bread, traditional sweets/cakes, traditional Italian food, a South Tirolean cocktail, and (interest-based) a glass of top wine or craft beer from a local microbrewery.",
    whatToExpectHistory:
      "Overview of the town's most significant monuments and history as a vital Middle-Ages trading station; its complicated modern history as a territory contested between two countries; how that shaped today's multicultural, cosmopolitan city.",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 10900,
    childCents: 4950,
  },
  {
    slug: "trento-street-food-tour",
    title: "Trento Street Food Tour",
    categorySlug: "street-food-tours",
    description:
      "Private walk savoring samples from Trento's unique street food eateries while learning about its medieval history, monumental Cathedral, elegant noble palaces and imposing castle.",
    tourType: "Private",
    groupSizeLabel: "Min 1 Max 8",
    language: "English",
    daysOffered: "Tue–Sat",
    startingTime: "11:00 am",
    durationLabel: "2.5 hrs",
    meetingPoint: "Piazza Dante, 38122 Trento, TN, Italy (guide waits under the statue)",
    highlights: [
      "Discover the historical center of Trento, the 'Painted City'",
      "Taste different types of local food and drinks like locals do",
      "Stroll through Duomo Square and explore the city's artistic treasures",
      "Limited to min 2 / max 10 for a personal experience",
    ],
    whatsIncluded: "English speaking tour guide; All food tastings",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_STANDARD,
    whatToExpectFood:
      "Sample local cold-cuts, special sweets and coffee, a seasonal food item, and a typical Italian aperitivo at several stalls (seasonal, subject to change). Ends with a typical Aperitivo with drinks and finger food at a popular local spot.",
    whatToExpectHistory:
      "Trento's history from Roman times through the Middle Ages, as a town ruled by prince-bishops and site in 1545 of the ecumenical Council of Trent, which shaped its artistic/architectural development (frescoed palaces still visible today). Also covers its 150 years as a port city and how the city layout was changed.",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 6300,
    priceIsFrom: true,
    childCents: 4900,
  },
  {
    slug: "christmas-markets",
    title: "Bolzano Street Food Tour® & Christmas Markets",
    categorySlug: "street-food-tours",
    description:
      "Behind-the-scenes access to the alpine town's most delectable treats in the afternoon, amid the light shows and Christmas decorations of a magical, festive atmosphere. Small group for personalized attention; visits the town's oldest bakery and hidden landmarks. Valid Nov 26 2026 – Jan 6 2027 only.",
    tourType: "Semi-Private",
    groupSizeLabel: "Min 2 Max 10",
    language: "English",
    daysOffered: "Every day (Mon–Sun)",
    startingTime: "4:00 pm",
    durationLabel: "2.5 hrs",
    meetingPoint: "In front of Cafè Loacker, Piazza Walther 11, 39100 Bolzano",
    validityLabel: "Nov 26 2026 – Jan 6 2027",
    highlights: [
      "A seasonal, small-group walking tour of Bolzano's street food",
      "Explore Italy's most popular and visited Christmas Market",
      "Taste fresh seasonal treats like Gingerbread and mulled wine",
      "Discover under-the-radar stops like the town's oldest bakery and a Franciscan church",
    ],
    whatsIncluded: "English speaking tour guide; All food tastings",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_STANDARD,
    whatToExpectFood:
      "5 stops with local coldcuts and cheese, traditional Christmas sweets, Bruschette and Knoedel (bread dumplings), a drink (beer/wine/soda), and traditional mulled wine.",
    whatToExpectHistory:
      "Historical center tour during the holiday season; the town's history as an old trading town, its main monuments, and Christmas-specific culinary traditions; orientation to the Christmas market to explore independently afterward.",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 10900,
    childCents: 4950,
  },
  {
    slug: "farmhouse-private-cooking-class",
    title: "Farmhouse Private Cooking Class",
    categorySlug: "cooking-classes",
    description:
      "Private cooking experience in an authentic Maso-Farmhouse on the Ritten plateau above Bolzano. English-speaking guide introduces farmer traditions/customs; learn centuries-old recipes from a local chef with a Dolomites view.",
    tourType: "Private",
    groupSizeLabel: "Min 2 Max 4",
    language: "English",
    daysOffered: "Jan–Aug, Mon–Fri",
    startingTime: "8:30 am",
    durationLabel: "4 hrs",
    meetingPoint: MEETING_CAFE_MOZART,
    highlights: [
      "Discover the unique cuisine and culture of South Tyrol",
      "Learn Knoedeln (bread dumplings) and Schlutzkrapfen (half-moon filled pasta) with a local chef",
      "Visit a typical Maso-Farmhouse",
      "Savor your own cooking with the view of the Dolomites",
    ],
    whatsIncluded:
      "Private transportation to/from location; cooking class; English-speaking guide; lunch with wine and water; recipes.",
    whatsNotIncluded: "Optional tips",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_COOKING_CLASS,
    whatToExpectFood:
      "Taught by Mali, the family farm's experienced cook (has a recipe book). Learn Schlutzkrapfen (spinach ravioli) and Kaese Knoedel, plus Kaiserschmarrn and apple fritters for dessert; meal paired with a bottle of wine and water.",
    whatToExpectHistory:
      "~20-min guided drive to the Ritten plateau, historically a summer retreat ('Sommerfrische', from June 29 for 72 days) for wealthy Bolzano families since the 18th century; home to Europe's tallest Earth Pyramids.",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 20300,
    priceIsFrom: true,
  },
  {
    slug: "south-tyrol-wine-road-cooking-class",
    title: "Cooking Class on the South Tyrol Wine Road",
    categorySlug: "cooking-classes",
    description:
      "Private cooking class and wine pairing at a local farm on the South Tyrol Wine Road (70 wineries, the warmest alpine lake in Europe). Learn centuries-old recipes from a local chef amid vineyard and rolling-hill views.",
    tourType: "Half-day Private",
    groupSizeLabel: "Min 2 Max 6 (email for larger groups)",
    language: "English",
    daysOffered: "Wed–Sat",
    startingTime: "10:00 am",
    durationLabel: "4 hrs",
    meetingPoint: "Bolzano (In front of Cafè Mozart unless agreed otherwise)",
    highlights: [
      "Drive through the South Tyrol Wine Road, vast vineyards of international and indigenous wines",
      "Guide commentary on the area's charming villages",
      "Learn 2 typical South Tyrol dishes from a local chef",
      "Included lunch paired with high-quality local wines",
    ],
    whatsIncluded:
      "Transportation by private 7-seat minivan; English speaking guide; cooking class + lunch; beverages included; recipes.",
    whatsNotIncluded: "Everything not mentioned in 'What's included'",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_COOKING_CLASS,
    whatToExpectFood:
      "At a Buschenschank/Agriturismo on the Wine Road (home of Gewuerztraminer, Lagrein, Vernatsch). Learn Knoedeln and fresh Tagliatelle; taste a traditional Brettljause platter (Speck, local cheeses, pickles); meal paired with the Agriturismo's own wine.",
    whatToExpectHistory:
      "Drive through the Wine Road (16 wine villages), guide commentary on scenic highlights en route to/from the farm.",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 12900,
    priceIsFrom: true,
  },
  {
    slug: "hike-and-cheese-workshop",
    title: "Hike in the Dolomites & Cheese Workshop",
    categorySlug: "cooking-classes",
    description:
      "Private tour combining an easy hike on the Siusi plateau (Europe's largest alpine meadow) with a cheese-making workshop in an authentic mountain hut. Family-friendly.",
    tourType: "Full-day Private",
    groupSizeLabel: "Min 2",
    language: "English",
    daysOffered: "June to mid-October",
    startingTime: "Mornings",
    durationLabel: "6 hrs",
    meetingPoint: "Walther Square or hotel in Bolzano",
    highlights: [
      "Ride the cable car to Ortisei, Gardena Valley",
      "Panoramic hike with awe-inspiring Dolomites views",
      "Learn traditional South Tyrolean cheesemaking in one of the area's oldest huts",
      "Optional upgrade — carriage ride on Europe's most beautiful meadow",
    ],
    whatsIncluded:
      "English speaking guide; private transfer Bolzano–Siusi and return from Ortisei; one-way cable car tickets; cheese workshop with tasting (beverages not included).",
    whatsNotIncluded: "Lunch; anything not listed under 'What's included'",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Bad weather = reschedule, or refund if not possible.",
    dietaryInfo: DIETARY_HIKE,
    whatToExpectFood:
      "Visit the dairy lab in an old mountain hut, learn the cheese-making process and how to decorate with fresh edible mountain flowers from the chef's garden, then enjoy the results. Optional add-on: buggy ride at extra cost (added at checkout).",
    whatToExpectHistory:
      "Private transfer to Kompatsch village on the Siusi plateau (6,500 ft, Europe's largest alpine meadow); easy hike with guide sharing legends, flora/fauna facts and local population info; ends with cable car/chairlift to Ortisei in Val Gardena for a stroll/coffee before transfer back.",
    whoShouldTakeIt: "Active travelers, nature lovers, foodies, families",
    priceOnRequest: true,
  },
  {
    slug: "south-tyrol-wine-road-tour-full-day",
    title: "The South Tyrol Wine Road Full Day Tour",
    categorySlug: "wine-tours",
    description:
      "Full-day tour of the South Tyrol Wine Road — vineyards, fruit orchards, castles and historical manors — including a historical winery visit and the Wine Museum in Tramin.",
    tourType: "Private",
    groupSizeLabel: "Min 2 Max 7",
    language: "English",
    daysOffered: "Fridays, May–October",
    startingTime: "10:00 am",
    durationLabel: "7 hrs",
    meetingPoint: `${MEETING_CAFE_MOZART} (or hotel)`,
    highlights: [
      "Discover exquisite South Tyrol wines, ancient villages and impressive castles",
      "Visit an award-winning winery's vineyards/cellar plus tasting",
      "Explore the villages of Caldaro and Termeno",
      "Learn the origins of Gewürztraminer at the Tramin Wine Museum",
    ],
    whatsIncluded:
      "English speaking driver-guide; walking tour of Caldaro & Termeno; winery visit + vineyard tour + 4-wine tasting; Wine Museum visit + 3-wine tasting; Mercedes Class V van (or similar) with face-to-face leather seats.",
    whatsNotIncluded: "Lunch (not included)",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_STANDARD,
    whatToExpectFood:
      "Walking tour ending at the Tramin Wine Museum (3 wine tastings); lunch (not included) at a traditional restaurant near Caldaro Lake; historical winery visit with guided vineyard tour and tasting on a panoramic terrace. Itinerary may be reversed based on winery availability.",
    whatToExpectHistory:
      "16 wine villages along the Wine Road; Termeno's ancient buildings, arched stone doors, colorful façades and Alto Adige's tallest bell tower; Caldaro's 'Oltradige art style' buildings (Renaissance + Gothic).",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 19800,
    priceIsFrom: true,
  },
  {
    slug: "caldaro-village-wine-road-half-day",
    title: "Caldaro Village & The Wine Road Half Day Tour",
    categorySlug: "wine-tours",
    description:
      "Half-day visit to the village of Caldaro and the Wine Road — vineyards, orchards, castles/manors, Lake Caldaro views, and a winery tour/tasting.",
    tourType: "Private",
    groupSizeLabel: "Min 2 Max 6",
    language: "English",
    daysOffered: "Every day, all year",
    startingTime: "10:00 am or 2:00 pm",
    durationLabel: "4 hrs",
    meetingPoint: `${MEETING_CAFE_MOZART} (or hotel)`,
    highlights: [
      "Discover Caldaro's interesting architecture",
      "Visit an award-winning winery's vineyards/cellar plus tasting",
      "Walk the Wine Trail and learn about South Tyrol winemaking",
      "Views of the landscape, castles and manors",
    ],
    whatsIncluded:
      "Private driver and English-speaking guide; walking tour of Caldaro; winery cellar visit + 4-wine tasting; Mercedes Class V van (or similar) with face-to-face leather seats.",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_STANDARD,
    whatToExpectFood:
      "Panoramic viewpoint over Lake Caldaro; private guided cellar tour and wine tasting at a local winery; short walk on the Wine Trail through vineyards learning about local winemaking. Itinerary may be reversed depending on arrival time.",
    whatToExpectHistory:
      "16 wine villages along the Wine Road; Caldaro's 'Oltradige art style' architecture (late Gothic + Italian Renaissance, developed under Claudia de' Medici and Ferdinand of Austria).",
    whoShouldTakeIt: "Suitable for everyone",
    adultCents: 9900,
    priceIsFrom: true,
  },
  {
    slug: "bolzano-wine-and-more-with-wine-expert",
    title: "Bolzano Wine & More Tour with Wine Expert",
    categorySlug: "wine-tours",
    description:
      "Walking tour of Bolzano's wine town history and tradition with a private wine expert, stopping at two wine shops to learn each wine's story and food-pairing tips. Optional Spirits Tasting upgrade (+€10 pp) adds 3 local Schnaps/liquor tastings and extends to 2 hrs — selectable at checkout.",
    tourType: "Semi-Private",
    groupSizeLabel: "Min 2 Max 8",
    language: "English",
    daysOffered: "Tue & Thu, all year",
    startingTime: "5:00 pm",
    durationLabel: "1.5 or 2 hrs",
    meetingPoint: MEETING_WALTHER,
    highlights: [
      "Taste indigenous Bolzano-area wines with a private wine expert",
      "Learn the history/tradition of South Tyrolean wines",
      "Optional Spirits Tasting Package upgrade",
      "Stop at two wine shops with pairing tips",
    ],
    whatsIncluded:
      "English speaking wine expert; short walking tour of historical center; 2 wine-shop stops for 4 glasses of South Tyrolean wine tastings with snacks (olives, taralli, finger food).",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_18PLUS_STANDARD,
    whatToExpectFood:
      "Two South Tyrolean and two Italian wine tastings with local snacks at two wine shops; guide explains varieties/techniques; option to purchase favorites at the end.",
    whatToExpectHistory:
      "History of Bolzano as a wine town since pre-Roman times; the indigenous Lagrein and Santa Maddalena grapes; the vineyards extending to the historic center; monasteries' role in the wine trade.",
    whoShouldTakeIt: "18+ with valid ID",
    adultCents: 8900,
    priceIsFrom: true,
  },
  {
    slug: "rooftops-of-bolzano",
    title: "Rooftops of Bolzano Walking Tour",
    categorySlug: "wine-tours",
    description:
      "Discover medieval Bolzano from above — Dolomites views and hidden historical-house corners — with stops at two trendy rooftop bars and a chic terrace bar for local cocktails, Italian-style happy hour, and guide stories/tips.",
    tourType: "Semi-Private",
    groupSizeLabel: "Min 2 Max 8",
    language: "English",
    daysOffered: "Wed & Fri",
    startingTime: "5:30 pm",
    durationLabel: "1.5–2 hrs",
    meetingPoint: MEETING_WALTHER,
    highlights: [
      "Experience the best rooftop bars and a chic terrace bar",
      "Enjoy views while sipping drinks and learning medieval history",
      "Discover local cocktails with snacks",
      "Learn the ritual of aperitivo in Italian daily life",
    ],
    whatsIncluded:
      "English-speaking local guide; short walking tour of historical center; stops at two rooftop bars + one terrace bar; 3 cocktails and snacks (alcohol-free options available).",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "In case of rain, offered indoors",
    dietaryInfo: DIETARY_18PLUS_STANDARD,
    whatToExpectFood:
      "Three stops with local drinks and snacks, including cocktails prepared by skilled bartenders, viewed from the town's best rooftops.",
    whatToExpectHistory:
      "The rooftop bars sit in the historic center of medieval Bolzano, founded in the 11th century by the Bishop of Trento; stories about its role as a trading post and its prominent/patrician houses.",
    whoShouldTakeIt: "18+ with valid ID",
    adultCents: 9900,
  },
  {
    slug: "beers-and-bites-tour",
    title: "Beers & Bites Tour with Beer Expert",
    categorySlug: "wine-tours",
    description:
      "Discover South Tyrol's 1,000-year-old beer tradition (8 regional craft breweries, 2 in Bolzano's medieval center) with a beer expert across 3 locations, including the region's most famous brewery (#6 in the Italian market) and the town's oldest tavern.",
    tourType: "Semi-Private",
    groupSizeLabel: "Min 2 Max 8",
    language: "English",
    daysOffered: "Mon & Wed, all year",
    startingTime: "6:30 pm",
    durationLabel: "2 hrs",
    meetingPoint: MEETING_WALTHER,
    highlights: [
      "Stop at South Tyrol's most famous brewery (#6 in Italian market)",
      "Taste 6 different beers with 2 food pairings",
      "Visit the oldest tavern in town",
      "Guided by a professional beer sommelier/beer master",
    ],
    whatsIncluded:
      "English-speaking beer expert; short walking tour of historical center; stops at a beer pub + two craft breweries; 1 full beer (0.33l) + 5 beer tastings (0.1l each) + two food tastings.",
    whatToWear: "Comfortable clothing and shoes",
    weatherPolicy: "Rain or shine",
    dietaryInfo: DIETARY_18PLUS_STANDARD,
    whatToExpectFood:
      "Variety of beer styles tasted (Pils, Weizen, Dunkel, Porter, IPA) with food pairings at 3 walkable locations; option to continue exploring after the tour.",
    whatToExpectHistory:
      "Tastings held in the 400-year-old oldest tavern in town (with the only Biergarten in town) and one of the oldest buildings in the center; visit to a nationally known brewery's pub; walk through medieval Bolzano (founded 11th century) and its arches.",
    whoShouldTakeIt: "18+ with valid ID",
    adultCents: 10900,
  },
  {
    slug: "tramin-gewurztraminer-tour",
    title: "Tramin — Cradle of Gewürztraminer Private HD Tour",
    categorySlug: "wine-tours",
    description:
      "PLACEHOLDER CONTENT — this tour's original page could not be recovered from the old site (its catalog card linked to the homepage instead of its own page). Only the catalog teaser survived: a half-day private wine tour, April to mid-August, Monday to Saturday. Replace this description with real copy supplied by the client before launch.",
    tourType: "Private (assumed, per category)",
    daysOffered: "April to Mid-August, Mon–Sat",
    durationLabel: "Half Day (assumed)",
    priceIsFrom: true,
    adultCents: 9900,
  },
  {
    slug: "eastern-dolomites-christmas-markets",
    title: "Eastern Dolomites & Christmas Markets",
    categorySlug: "winter-tours",
    description:
      "Discover the markets of the Ladin Valleys of Gardena & Badia, with breathtaking Dolomites views.",
    validityLabel: "Dec 2 – Jan 1",
    daysOffered: "Weekend only",
    durationLabel: "8/9 hrs",
    whatsIncluded:
      "Private driver; Deluxe 7-seater minibus; Private EN/IT/DE tour guide; Pick up/drop off Bolzano; VAT and fees included.",
    priceIsFrom: true,
    adultCents: 10800,
  },
  {
    slug: "sterzing-innsbruck-christmas-markets",
    title: "Sterzing & Innsbruck Christmas Markets",
    categorySlug: "winter-tours",
    description:
      "Discover the Christmas markets of Brixen (Episcopal City) and Sterzing (Italy's northernmost town), then cross into Austria for a few hours.",
    validityLabel: "Nov 25 – Jan 6",
    daysOffered: "Every day",
    durationLabel: "8/9 hrs",
    whatsIncluded:
      "Private driver; Deluxe 7-seater minibus; Private EN/IT/DE tour guide; Pick up/drop off Bolzano; VAT and fees included.",
    priceIsFrom: true,
    adultCents: 10800,
  },
  {
    slug: "lakes-braies-pusteria-christmas-markets",
    title: "Lakes Braies & Pusteria Christmas Markets",
    categorySlug: "winter-tours",
    description:
      "Discover the Christmas markets of Bruneck, stop at the charming Lake Braies, and Brixen on the way back.",
    validityLabel: "Nov 25 – Jan 6",
    daysOffered: "Every day",
    durationLabel: "8/9 hrs",
    whatsIncluded:
      "Private driver; Deluxe 7-seater minibus; Private EN/IT/DE tour guide; Pick up/drop off Bolzano; VAT and fees included.",
    priceIsFrom: true,
    adultCents: 10800,
  },
  {
    slug: "majestic-dolomites-husky-sled-dog",
    title: "Majestic Dolomites & Husky Sled-Dog Activity",
    categorySlug: "winter-tours",
    description:
      "Soak in the amazing views of the Dolomites' most iconic peaks and become a musher of a pack of huskies.",
    validityLabel: "Dec – Feb",
    daysOffered: "Every day (not Mondays)",
    durationLabel: "8 hrs",
    whatsIncluded:
      "Private driver-guide EN/DE/IT; Deluxe 7-seater minibus; Pick up/drop off Bolzano; 1-hour husky sled-dog experience; VAT and fees included.",
    priceIsFrom: true,
    adultCents: 18500,
  },
  {
    slug: "tenno-rango-riva-christmas-markets",
    title: "Tenno, Rango and Riva Christmas Markets",
    categorySlug: "winter-tours",
    description:
      "Discover the Christmas markets of Trentino: Canale di Tenno and Rango (beautiful borghi) and charming Riva on the shore of Lake Garda.",
    validityLabel: "Nov 25 – Jan 6",
    daysOffered: "Weekend only",
    durationLabel: "6 hrs",
    whatsIncluded:
      "Private driver; Deluxe 7-seater minibus; Private EN/IT/DE tour guide; Pick up/drop off Trento; VAT and fees included.",
    priceIsFrom: true,
    adultCents: 12500,
  },
  {
    slug: "trento-street-food-tour-christmas-market",
    title: "Trento Street Food Tour & Christmas Market",
    categorySlug: "winter-tours",
    description:
      "Taste samples from Trento's unique street food eateries; learn about its medieval past, Cathedral, and elegant palaces.",
    validityLabel: "Nov 25 – Jan 6",
    daysOffered: "Every day",
    durationLabel: "max 3 hrs",
    whatsIncluded:
      "EN/IT/DE speaking tour guide; small group; 5 food tastings; 1 special drink; beer or wine; VAT included.",
    priceIsFrom: true,
    adultCents: 9000,
  },
  {
    slug: "sledding-great-dolomites-road",
    title: "Sledding & The Great Dolomites Road",
    categorySlug: "winter-tours",
    description:
      "Soak in the amazing views of the Dolomites' most iconic peaks and become a musher of a pack of huskies.",
    validityLabel: "Dec – Mar",
    daysOffered: "Every day",
    durationLabel: "6 hrs",
    whatsIncluded:
      "Private driver-guide EN/DE/IT; Deluxe 7-seater minivan; Pick up/drop off Bolzano; tickets for lift & sled rental; VAT and fees included.",
    priceOnRequest: true,
  },
  {
    slug: "snowmobile-great-dolomites-road",
    title: "Snowmobile & The Great Dolomites Road",
    categorySlug: "winter-tours",
    description:
      "Experience the Great Dolomites Road and ascend by snowmobile shuttle to the Auronzo refuge at the foot of the Three Peaks; descend by sleigh.",
    validityLabel: "Dec – Apr (based on natural snow)",
    daysOffered: "Every day",
    durationLabel: "9 hrs",
    whatsIncluded:
      "Private driver/tour leader EN/DE/IT; Deluxe 7-seater minivan; snowmobile shuttle & sleigh rental; Pick up/drop off Bolzano; VAT and fees included.",
    priceOnRequest: true,
  },
  {
    slug: "snowshoeing-funes-valley-christmas-market",
    title: "Snowshoeing in Funes Valley & Christmas Market",
    categorySlug: "winter-tours",
    description:
      "Hike in the untouched, magical Puez Odle Natural Park; on the way back, stop at a local Christmas Market (Dec–Jan only).",
    validityLabel: "Late Nov – Apr, based on snow",
    daysOffered: "Every day (snow-dependent)",
    durationLabel: "7 hrs",
    whatsIncluded:
      "Private driver/tour leader EN/DE/IT; Deluxe 7-seater minivan; snowshoes and sticks rental; Pick up/drop off Bolzano; VAT included.",
    priceOnRequest: true,
  },
];

interface TransferRouteSeed {
  origin: string;
  destination: string;
  priceCents: number;
  maxPax: number;
  maxLuggage: number;
  durationLabel: string;
  supplements: { label: string; priceCents: number }[];
}

const SUPPLEMENTS = [
  { label: "Merano", priceCents: 6300 },
  { label: "Bressanone", priceCents: 6300 },
  { label: "Brunico", priceCents: 12500 },
  { label: "Alta Badia", priceCents: 20000 },
  { label: "Val Gardena", priceCents: 12500 },
  { label: "Vipiteno", priceCents: 12500 },
  { label: "Cortina", priceCents: 18800 },
];

const TRANSFER_ROUTES: TransferRouteSeed[] = [
  {
    origin: "Milan Malpensa Airport",
    destination: "Bolzano",
    priceCents: 43800,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "3 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Milan Linate Airport",
    destination: "Bolzano",
    priceCents: 37500,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "2.5 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Venice Airport",
    destination: "Bolzano",
    priceCents: 37500,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "3 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Verona Airport",
    destination: "Bolzano",
    priceCents: 30000,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "1.5 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Bergamo Airport",
    destination: "Bolzano",
    priceCents: 33800,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "2 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Munich Airport",
    destination: "Bolzano",
    priceCents: 43800,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "3 h",
    supplements: SUPPLEMENTS,
  },
  {
    origin: "Innsbruck Airport",
    destination: "Bolzano",
    priceCents: 28800,
    maxPax: 7,
    maxLuggage: 7,
    durationLabel: "1 h",
    supplements: SUPPLEMENTS,
  },
];

const BLOG_PLACEHOLDER_BODY =
  "PLACEHOLDER CONTENT — this post's original body copy was not re-extracted from the old " +
  "site during the content migration (only the title, approximate publish date, and tag " +
  "cloud survived). Replace with real copy, or retire the post, before launch.";

interface BlogPostSeed {
  slug: string;
  title: string;
  publishedAt: string; // ISO date
}

const BLOG_POSTS: BlogPostSeed[] = [
  {
    slug: "thanksgiving-south-tyrol-style",
    title: "Thanksgiving, South Tyrol style!",
    publishedAt: "2020-10-01",
  },
  {
    slug: "elderflower-syrup-facts-and-myths",
    title: "Elderflower Syrup: Facts and myths",
    publishedAt: "2020-05-01",
  },
  {
    slug: "armchair-travel-books-south-tyrol",
    title: "Armchair Travel Books to take you to South Tyrol",
    publishedAt: "2020-04-01",
  },
  {
    slug: "10-reasons-to-visit-south-tyrol",
    title: "10 Reasons to Visit South Tyrol this Year",
    publishedAt: "2018-02-01",
  },
  {
    slug: "stollen-or-zelten",
    title: "Stollen or Zelten? That's the question!",
    publishedAt: "2017-12-01",
  },
  {
    slug: "christmas-traditions-south-tyrol",
    title: "Christmas Traditions in South Tyrol",
    publishedAt: "2017-12-15",
  },
  {
    slug: "eat-drink-court-of-king-laurin",
    title: "Eat and drink at the Court of King Laurin!",
    publishedAt: "2017-09-01",
  },
  {
    slug: "24-hours-in-bolzano-through-local-eyes",
    title: "24 Hours in Bolzano through the Eyes of a Local",
    publishedAt: "2017-09-15",
  },
];

async function main() {
  const categoryIdBySlug = new Map<string, string>();
  const photoUrlBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const category = await db.category.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        photoUrl: c.photoUrl,
        altText: c.altText,
        sortOrder: c.sortOrder,
        isBookable: c.isBookable ?? true,
      },
      // Only content fields re-applied on re-seed — an admin's isActive/
      // sortOrder edits made through the (future) admin panel aren't
      // clobbered by re-running this script.
      update: {
        name: c.name,
        description: c.description,
        photoUrl: c.photoUrl,
        altText: c.altText,
      },
    });
    categoryIdBySlug.set(c.slug, category.id);
    photoUrlBySlug.set(c.slug, category.photoUrl);
  }

  for (const t of TOURS) {
    const categoryId = categoryIdBySlug.get(t.categorySlug);
    if (!categoryId) throw new Error(`Unknown categorySlug "${t.categorySlug}" for tour ${t.slug}`);
    const heroImageUrl = photoUrlBySlug.get(t.categorySlug);

    const tour = await db.tour.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        title: t.title,
        categoryId,
        summary: firstSentence(t.description),
        description: t.description,
        heroImageUrl,
        tourType: t.tourType,
        groupSizeLabel: t.groupSizeLabel,
        language: t.language,
        daysOffered: t.daysOffered,
        startingTime: t.startingTime,
        durationLabel: t.durationLabel,
        meetingPoint: t.meetingPoint,
        highlights: t.highlights ?? [],
        whatsIncluded: t.whatsIncluded,
        whatsNotIncluded: t.whatsNotIncluded,
        whatToWear: t.whatToWear,
        weatherPolicy: t.weatherPolicy,
        dietaryInfo: t.dietaryInfo,
        whatToExpectFood: t.whatToExpectFood,
        whatToExpectHistory: t.whatToExpectHistory,
        whoShouldTakeIt: t.whoShouldTakeIt,
        priceIsFrom: t.priceIsFrom ?? false,
        priceOnRequest: t.priceOnRequest ?? false,
        validityLabel: t.validityLabel,
      },
      // heroImageUrl is the only field re-applied on an already-seeded tour:
      // Task 4 introduces it after the initial content-inventory seed (Task
      // 3) already ran, so every tour needs this one field backfilled on
      // re-seed without clobbering any other field an admin may have edited.
      update: {
        heroImageUrl,
      },
    });

    if (t.adultCents) {
      await db.priceTier.upsert({
        where: { tourId_type: { tourId: tour.id, type: PriceTierType.ADULT } },
        create: {
          tourId: tour.id,
          type: PriceTierType.ADULT,
          priceCents: t.adultCents,
          minPersons: 1,
        },
        update: {},
      });
    }
    if (t.childCents) {
      await db.priceTier.upsert({
        where: { tourId_type: { tourId: tour.id, type: PriceTierType.CHILD } },
        create: {
          tourId: tour.id,
          type: PriceTierType.CHILD,
          priceCents: t.childCents,
          minPersons: 1,
        },
        update: {},
      });
    }
  }

  // Upsert keyed on the real compound-unique constraint (origin, destination).
  // After constraint is in place, this is purely idempotent: no in-memory Map needed.
  for (const r of TRANSFER_ROUTES) {
    await db.transferRoute.upsert({
      where: { origin_destination: { origin: r.origin, destination: r.destination } },
      create: {
        origin: r.origin,
        destination: r.destination,
        priceCents: r.priceCents,
        maxPax: r.maxPax,
        maxLuggage: r.maxLuggage,
        durationLabel: r.durationLabel,
        supplements: { create: r.supplements },
      },
      update: {
        priceCents: r.priceCents,
        maxPax: r.maxPax,
        maxLuggage: r.maxLuggage,
        durationLabel: r.durationLabel,
        supplements: { deleteMany: {}, create: r.supplements },
      },
    });
  }

  for (const p of BLOG_POSTS) {
    // Parse date at noon UTC to avoid timezone shifts: "2020-10-01T12:00:00Z"
    const publishedAt = new Date(`${p.publishedAt}T12:00:00Z`);
    await db.blogPost.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        content: BLOG_PLACEHOLDER_BODY,
        publishedAt,
      },
      update: {
        publishedAt,
      },
    });
  }

  console.log(
    `Seeded ${CATEGORIES.length} categories, ${TOURS.length} tours, ${TRANSFER_ROUTES.length} transfer routes, ${BLOG_POSTS.length} blog posts.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
