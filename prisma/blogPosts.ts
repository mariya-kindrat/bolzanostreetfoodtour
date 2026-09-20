import type { PrismaClient } from "../lib/generated/prisma/client";

/** Body the content migration left behind; seeding replaces it, never a real edit. */
export const BLOG_PLACEHOLDER_BODY =
  "PLACEHOLDER CONTENT — this post's original body copy was not re-extracted from the old " +
  "site during the content migration (only the title, approximate publish date, and tag " +
  "cloud survived). Replace with real copy, or retire the post, before launch.";

export interface BlogPostSeed {
  slug: string;
  title: string;
  publishedAt: string; // ISO date
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  tags: string[];
  content: string;
}

// Photos already in the repo (site paths pass the same allow-list as uploaded ones).
const PHOTOS = {
  farmhouseKitchen: {
    src: "/images/home/mosaic/farmhouse-kitchen.jpg",
    alt: "A vintage kitchen with copper pots and fresh vegetables on a wooden table",
  },
  arcadeStreet: {
    src: "/images/home/mosaic/bolzano-arcade-street.jpg",
    alt: "Pastel arcaded buildings along a cobbled street in Bolzano's old town",
  },
  archAlley: {
    src: "/images/home/mosaic/bolzano-arch-wine.jpg",
    alt: "A stone archway over a cobbled alley in Bolzano's old town, with a cafe table beyond",
  },
  parmigiano: {
    src: "/images/home/mosaic/market-parmigiano.jpg",
    alt: "A vendor cutting Parmigiano Reggiano at a market stall, wheels and wedges in front of him",
  },
  christmasStall: {
    src: "/images/home/mosaic/christmas-market-stall.jpg",
    alt: "A couple browsing hanging ornaments at a Christmas market stall in the evening",
  },
  vineyardVillage: {
    src: "/images/home/mosaic/vineyard-village.jpg",
    alt: "Autumn vineyard rows in South Tyrol with a village and snowy mountains behind",
  },
  bakeryWindow: {
    src: "/images/home/hero-market.jpg",
    alt: "Pretzels, crisp rye flatbread and almond biscotti in a Bolzano bakery window",
  },
  dolomites: {
    src: "/images/home/hero-dolomites.jpg",
    alt: "The Tre Cime di Lavaredo rising out of clouds in the Dolomites",
  },
  winterMarket: {
    src: "/images/tours/winter-tour-hero.jpg",
    alt: "A Christmas market stall at night with a red and white awning and glowing lanterns",
  },
  meadows: {
    src: "/images/tours/cooking-class-hero.jpg",
    alt: "Green meadows and forest with earth pyramids on the Ritten plateau above Bolzano",
  },
  fruitMarket: {
    src: "/images/tours/street-food-hero.jpg",
    alt: "A busy fruit market between historic buildings in Bolzano",
  },
  vineRow: {
    src: "/images/tours/wine-tour-hero.jpg",
    alt: "A row of grapevines heavy with dark grapes",
  },
};

type Photo = (typeof PHOTOS)[keyof typeof PHOTOS];

function photo(p: Photo): string {
  return `![${p.alt}](${p.src})`;
}

// SAMPLE COPY: written to give the redesigned blog real content to show. The owner
// should replace it with their own stories before launch (see planning/project-progress.md).
export const BLOG_POSTS: BlogPostSeed[] = [
  {
    slug: "thanksgiving-south-tyrol-style",
    title: "Thanksgiving, South Tyrol style!",
    publishedAt: "2020-10-01",
    excerpt:
      "How a very American holiday finds a home in the Alps: local flavours, a crowded table and a long, warm evening with dumplings.",
    coverImageUrl: PHOTOS.farmhouseKitchen.src,
    coverImageAlt: PHOTOS.farmhouseKitchen.alt,
    tags: ["holidays", "traditions"],
    content: `Thanksgiving is not a South Tyrolean holiday, and that is exactly why we love hosting it here. Every year our friends from overseas ask the same question: can you really do it in the Alps? You can, and it turns out the region is the perfect place for a harvest feast.

## The Alpine twist

Late autumn is when farm kitchens are at their busiest, so the pantry is full of the right ingredients. We swap a few classics for local ones:

- **Speck** instead of bacon, thinly sliced and laid over the turkey to keep it juicy
- **Bread dumplings** (Knödel) standing in for stuffing
- **Apple strudel** sharing the dessert table with the pumpkin pie
- **A glass of local white** for the toast

${photo(PHOTOS.parmigiano)}

## Shopping is half the fun

We start the morning at the market, where the stallholders are happy to explain what goes with what. Ask for a small piece to taste first, then buy the wedge you liked. It is the easiest way to learn a cuisine, and it makes the table feel truly local.

## Give thanks, then pass the dumplings

By the time the candles are lit the kitchen is warm, the windows are steamed up and the table is far too small for everyone. That is the point. Whatever you call the holiday, a long meal shared with people you like is the same in every language.

If you are in Bolzano in November and want to celebrate with a local spin, get in touch. We would be glad to help you plan it.`,
  },
  {
    slug: "elderflower-syrup-facts-and-myths",
    title: "Elderflower Syrup: Facts and myths",
    publishedAt: "2020-05-01",
    excerpt:
      "A spring ritual in every South Tyrolean kitchen. Here is what actually matters when you make it, and a few kitchen myths worth retiring.",
    coverImageUrl: PHOTOS.meadows.src,
    coverImageAlt: PHOTOS.meadows.alt,
    tags: ["recipes", "traditions"],
    content: `When the elder trees bloom in late spring, half of South Tyrol seems to be out picking blossoms. The result is a pale, fragrant syrup that turns a glass of cold water or sparkling wine into something that tastes like the season.

## What you need

The recipe is short, which is why it is worth getting the details right:

1. Fresh blossoms picked on a dry, sunny morning
2. Sugar and water
3. A sliced lemon
4. A few days of patience

${photo(PHOTOS.farmhouseKitchen)}

## Myths we hear all the time

**"You must wash the blossoms."** Most home cooks prefer to shake them gently instead. Rinsing takes away pollen and much of the scent, and the scent is the whole point.

**"More sugar keeps it better."** A generous amount helps the syrup keep, but too much hides the flower. Follow a tested ratio and keep the bottles in the fridge.

**"Any elder will do."** Pick only blossoms you can identify with certainty, and stay away from roadsides. If you are unsure, buy a bottle from a local producer instead.

## How we like to serve it

- Two spoonfuls in cold sparkling water with ice and a slice of lemon
- Over yoghurt or a simple cake
- Mixed with white wine for an easy aperitivo

It is a small thing, but it captures what we love about eating here: seasonal, simple and made by someone who cares.`,
  },
  {
    slug: "armchair-travel-books-south-tyrol",
    title: "Armchair Travel Books to take you to South Tyrol",
    publishedAt: "2020-04-01",
    excerpt:
      "Can't travel right now? A reading list for the Dolomites and Bolzano: stories, history and food writing to keep the mountains close.",
    coverImageUrl: PHOTOS.archAlley.src,
    coverImageAlt: PHOTOS.archAlley.alt,
    tags: ["travel-tips", "books"],
    content: `Some trips start on the sofa. Whether you are planning a visit or simply missing the mountains, the right book can put you on a cobbled Bolzano street in a few pages. Here is how we would build a South Tyrol reading list.

## Start with the landscape

Look for writing about the Dolomites: climbers' memoirs, walking guides and books about the light that makes the peaks glow at dusk. They tell you where to look when you finally arrive.

${photo(PHOTOS.dolomites)}

## Then the history

South Tyrol has been part of more than one country in a single century, and that complicated story explains almost everything about the region today: two languages, a mix of traditions and a cuisine that borrows from both sides of the Alps. A good regional history is the most useful book you can pack.

## Do not skip the food writing

Cookbooks and food memoirs are the most honest guide to a place. Look for:

- Books on **alpine bread and baking**
- Collections of **farmhouse recipes**
- Wine writing on the **white grapes of the valleys**

## How to read your way into a trip

1. Pick one book about the landscape and one about the people
2. Note the towns and dishes that come up more than once
3. Turn that list into your itinerary

When you are ready to turn the reading into a real walk through town, we will be glad to show you the rest.`,
  },
  {
    slug: "10-reasons-to-visit-south-tyrol",
    title: "10 Reasons to Visit South Tyrol this Year",
    publishedAt: "2018-02-01",
    excerpt:
      "Mountains, markets, two languages on every menu and a wine region a short walk from the city. Ten good reasons to plan the trip.",
    coverImageUrl: PHOTOS.arcadeStreet.src,
    coverImageAlt: PHOTOS.arcadeStreet.alt,
    tags: ["travel-tips", "bolzano"],
    content: `Ask ten people why they love South Tyrol and you will get ten different answers. Here are the ten we hear most often.

1. **The Dolomites.** Jagged pale peaks that are worth the trip on their own.
2. **A city you can walk.** Bolzano's old town is compact, friendly and full of arcades.
3. **Two languages.** Italian and German share the street signs, the menus and the conversation.
4. **The markets.** Fruit, cheese, bread and speck, sold by people who know what they are selling.
5. **Wine with a view.** Vineyards climb the hillsides right up to the edge of town.
6. **Seasons that mean something.** Blossom in spring, harvest in autumn, Christmas markets in winter.
7. **Easy to explore.** Trains, cable cars and buses reach a surprising number of places.
8. **Farmhouse hospitality.** Simple food, generous portions and a warm welcome.
9. **Museums and history.** Small collections with big stories.
10. **Food you cannot get elsewhere.** The blend of alpine and Mediterranean cooking is genuinely its own.

${photo(PHOTOS.vineyardVillage)}

## The best way to see it

Do not try to do everything. Pick a base, choose two or three of the reasons above and leave time to wander. The best moments here are almost always unplanned: a doorway you walk through, a stall you stop at, a glass someone hands you.

If you would like a local to point you in the right direction, join one of our walks.`,
  },
  {
    slug: "stollen-or-zelten",
    title: "Stollen or Zelten? That's the question!",
    publishedAt: "2017-12-01",
    excerpt:
      "Two Christmas breads, one border. What separates a German Stollen from South Tyrol's dense fruit-and-nut Zelten, and which to pick up at the market.",
    coverImageUrl: PHOTOS.bakeryWindow.src,
    coverImageAlt: PHOTOS.bakeryWindow.alt,
    tags: ["christmas", "food"],
    content: `Walk past any bakery in Bolzano in December and you will see two very different Christmas breads competing for the same shelf space. One is the famous Stollen. The other, less known outside the region, is the Zelten.

## Stollen

A soft, buttery yeast loaf packed with dried fruit and finished with a thick dusting of sugar. It is rich, sliceable and meant to be kept for a while, getting better as it rests.

## Zelten

Zelten is the South Tyrolean answer: a dense, dark fruit bread packed with dried figs, nuts and candied fruit, with much less dough holding it together. Every family and every bakery has its own version, and each is defended with pride.

${photo(PHOTOS.christmasStall)}

## How to choose

- **Stollen:** soft and buttery, sweet and spiced, lovely with coffee
- **Zelten:** dense and chewy, fruity and nutty, lovely with a small glass of something strong

## Our advice

Do not choose. Buy a small piece of each at the Christmas market and compare them on a bench with a cup of hot spiced wine. Then argue about it with the person next to you, which is the most traditional part of all.`,
  },
  {
    slug: "christmas-traditions-south-tyrol",
    title: "Christmas Traditions in South Tyrol",
    publishedAt: "2017-12-15",
    excerpt:
      "Advent markets, candlelit streets and dishes that appear only once a year: a guide to how South Tyrol celebrates the season.",
    coverImageUrl: PHOTOS.winterMarket.src,
    coverImageAlt: PHOTOS.winterMarket.alt,
    tags: ["christmas", "traditions"],
    content: `Christmas in South Tyrol starts long before the 25th. From late November the squares fill with wooden stalls, the air smells of cinnamon and roasted chestnuts, and even a short walk to buy bread turns into an evening out.

## The Advent markets

The markets are the heart of the season. Wander slowly and you will find:

- Hand-carved wooden toys and decorations
- Warm mulled wine and hot apple drinks
- Stalls selling speck, cheese and pastries
- Musicians playing on the corner

## What is on the table

Christmas food here is a mix of Italian and Austrian habits. Expect rich soups and dumplings, roasted meats, and a great deal of baking, including fruit breads and biscuits that appear only at this time of year.

${photo(PHOTOS.farmhouseKitchen)}

## Small customs worth knowing

- Lights and candles in the windows, which make ordinary streets look like a picture book
- Family gatherings built around a long meal
- Quiet mornings after the busy evenings

## Visiting in winter

Dress warmly, arrive hungry and give yourself time. The best way to enjoy a Christmas market is to move slowly from stall to stall and taste as you go. If you would like a guide, we run tours through the season.`,
  },
  {
    slug: "eat-drink-court-of-king-laurin",
    title: "Eat and drink at the Court of King Laurin!",
    publishedAt: "2017-09-01",
    excerpt:
      "The legend of the rose garden that turned to stone, and what to eat and drink while you look up at the glowing peaks.",
    coverImageUrl: PHOTOS.dolomites.src,
    coverImageAlt: PHOTOS.dolomites.alt,
    tags: ["legends", "food"],
    content: `Every mountain region has its legends, and in the Dolomites the best-loved one belongs to King Laurin, the ruler of a dwarf kingdom and the owner of a magnificent rose garden.

## The legend in a minute

According to the story, Laurin's rose garden was so beautiful that he wanted to keep it hidden. He cast a spell so that no one could ever see it, by day or by night. But he forgot the twilight, and that is why the peaks still turn rose-coloured as the sun sets. Locals call it the alpenglow.

## What to eat while you watch

You do not need a royal banquet. The classic mountain table is generous and simple:

- **Speck and local cheese** with dark bread
- **Dumplings** in broth or with melted butter
- **Something sweet**, such as strudel, to finish

## What to drink

South Tyrol is a wine region, and its white wines suit the cooking beautifully. Ask for a local glass, or try a small glass of something stronger after a big meal.

${photo(PHOTOS.vineRow)}

## Plan your evening

Aim to be outdoors about an hour before sunset, with a warm layer and a good view. Stay for the colour, then head down for dinner. It is the best free entertainment in the Alps.`,
  },
  {
    slug: "24-hours-in-bolzano-through-local-eyes",
    title: "24 Hours in Bolzano through the Eyes of a Local",
    publishedAt: "2017-09-15",
    excerpt:
      "One day, one city, no rush: a morning at the market, lunch under the arcades and an evening with a view of the mountains.",
    coverImageUrl: PHOTOS.fruitMarket.src,
    coverImageAlt: PHOTOS.fruitMarket.alt,
    tags: ["bolzano", "travel-tips"],
    content: `If you only have a day in Bolzano, do not try to see everything. Here is how a local would spend it.

## Morning: start at the market

Go early. The stalls are freshly stocked, the vendors have time to chat and the light on the old buildings is lovely. Pick up fruit and something baked, and eat it on a bench.

${photo(PHOTOS.fruitMarket)}

## Late morning: a slow walk

Follow the arcades through the old town, popping into any shop or courtyard that looks interesting. The city is small enough that you cannot really get lost, and the best discoveries are the ones you did not plan.

## Lunch

Sit down somewhere simple and order something local. Dumplings, a plate of speck and cheese, or a warm soup are all good choices.

## Afternoon: culture or a cable car

Choose one:

- A museum, for a look at the region's past
- A cable car up the hillside for a big view over the valley

${photo(PHOTOS.archAlley)}

## Evening

Walk back through the old town as the lights come on, and stop for an aperitivo with a small plate of something to nibble. Then linger. Bolzano is at its best when nobody is in a hurry.

Want a local to lead the way? Join us on a walk and we will show you our favourite corners.`,
  },
];

/**
 * Inserts the posts and, for rows that still carry the migration placeholder, fills in the
 * sample copy. A body an admin has already edited is never overwritten, and neither is a
 * publish date (the admin can change it).
 */
export async function seedBlogPosts(db: PrismaClient): Promise<void> {
  for (const p of BLOG_POSTS) {
    // Noon UTC avoids timezone shifts when the date is shown.
    const publishedAt = new Date(`${p.publishedAt}T12:00:00Z`);
    const fields = {
      title: p.title,
      content: p.content,
      excerpt: p.excerpt,
      coverImageUrl: p.coverImageUrl,
      coverImageAlt: p.coverImageAlt,
      tags: p.tags,
    };
    await db.blogPost.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, publishedAt, ...fields },
      update: {},
    });
    await db.blogPost.updateMany({
      where: { slug: p.slug, content: BLOG_PLACEHOLDER_BODY },
      data: fields,
    });
  }
}
