export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type UploadCheck = { extension: string } | { error: string };

// Re-validated server-side: the client downscales, but its output is never trusted.
export function checkUpload(file: { type: string; size: number }): UploadCheck {
  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) return { error: "Only JPEG, PNG or WebP photos are allowed." };
  if (file.size === 0) return { error: "That file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Photos must be 4 MB or smaller." };
  return { extension };
}
