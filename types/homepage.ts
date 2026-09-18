export interface Tile {
  title: string;
  href: string;
  category: "food" | "wine" | "cooking" | "winter";
  image?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  origin: string;
  date: string;
}
