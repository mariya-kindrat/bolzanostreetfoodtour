const WORDS_PER_MINUTE = 200;

/** Lowercase, hyphenated, diacritics stripped: "Käse & Wein!" becomes "kase-wein". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Markdown reduced to readable text: images dropped, link text kept, markup characters removed. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(markdown: string): number {
  const words = plainText(markdown).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function extractImageUrls(markdown: string): string[] {
  return [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((match) => match[1]);
}

/** First `max` characters of the plain text, for meta descriptions. */
export function snippet(markdown: string, max = 155): string {
  return plainText(markdown).slice(0, max);
}
