/** "YYYY-MM-DD" in UTC for a date input, or "" when there is no valid date. */
export function toDateInputValue(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Noon UTC so a timezone can never shift the day; undefined for anything but a real calendar date. */
export function fromDateInputValue(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const iso = `${value}T12:00:00.000Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) || toDateInputValue(date) !== value ? undefined : iso;
}
