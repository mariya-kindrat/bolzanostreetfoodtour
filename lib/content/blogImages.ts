const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** Site paths and the Vercel Blob public host only; anything else would break next/image. */
export function isAllowedImageUrl(url: string): boolean {
  if (url.startsWith("/")) return !url.startsWith("//");
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}
