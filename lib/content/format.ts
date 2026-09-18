export function formatPriceCents(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

export function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}
