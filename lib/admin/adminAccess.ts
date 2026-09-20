/** Emails from the ADMIN_EMAILS env var: comma-separated, trimmed, lowercased, deduped. */
export function parseAdminEmails(raw: string | undefined): string[] {
  const emails = (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(emails)];
}

/** True when any of the user's verified emails is on the allow-list; an empty list allows nobody. */
export function isAdminEmail(verifiedEmails: string[], allowList: string[]): boolean {
  return verifiedEmails.some((email) => allowList.includes(email.toLowerCase()));
}
