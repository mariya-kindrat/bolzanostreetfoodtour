/** Contact link that prefills the form subject with the tour title. */
export function contactHref(title: string): string {
  return `/contact?tour=${encodeURIComponent(title)}`;
}
