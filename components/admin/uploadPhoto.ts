import { downscaleImage } from "@/components/admin/downscaleImage";

/** Downscales, uploads through the admin route, and returns the stored photo's url. */
export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", await downscaleImage(file));

  let res: Response;
  try {
    res = await fetch("/api/admin/blog/upload", { method: "POST", body: form });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) throw new Error(data?.error ?? "The upload failed. Please try again.");
  return data.url;
}
