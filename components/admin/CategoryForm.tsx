"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import type { Category } from "@/lib/generated/prisma/client";

// Plain native form elements (not components/ui/Input, which is a
// controlled value/onChange component built for the public site's
// client-rendered forms) — this form reads itself via FormData on submit,
// matching the same fetch-a-route-handler pattern as ContactForm/
// NewsletterForm rather than introducing a second form convention.
export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const body = {
      slug: String(form.get("slug") ?? ""),
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      photoUrl: String(form.get("photoUrl") ?? ""),
      altText: String(form.get("altText") ?? ""),
      sortOrder: Number(form.get("sortOrder") ?? 0),
      isActive: form.get("isActive") === "on",
      isBookable: form.get("isBookable") === "on",
    };

    const url = category
      ? `/api/admin/categories/${category.id}`
      : "/api/admin/categories";

    let res: Response;
    try {
      res = await fetch(url, {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // fetch itself rejects on a network failure (offline, unreachable) —
      // distinct from res.ok being false, which is guarded separately below.
      setError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label htmlFor="name">Name</label>
        <br />
        <input id="name" name="name" type="text" required defaultValue={category?.name} />
      </div>

      <div>
        <label htmlFor="slug">
          Slug (the catalog page&apos;s URL, e.g. <code>wine-tours</code> renders at{" "}
          <code>/wine-tours</code>)
        </label>
        <br />
        <input id="slug" name="slug" type="text" required defaultValue={category?.slug} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          name="description"
          required
          defaultValue={category?.description}
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="photoUrl">
          Photo path (hero rotation + catalog page — a site path such as
          /images/tours/wine.jpg; Vercel Blob upload isn&apos;t wired up yet)
        </label>
        <br />
        <input id="photoUrl" name="photoUrl" type="text" required defaultValue={category?.photoUrl} />
      </div>

      <div>
        <label htmlFor="altText">Photo alt text</label>
        <br />
        <input id="altText" name="altText" type="text" required defaultValue={category?.altText} />
      </div>

      <div>
        <label htmlFor="sortOrder">Sort order (lower shows first in the hero rotation)</label>
        <br />
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
        />
      </div>

      <div>
        <label htmlFor="isActive">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            defaultChecked={category?.isActive ?? true}
          />{" "}
          Active (shown on the site — in the hero rotation and its catalog page)
        </label>
      </div>

      <div>
        <label htmlFor="isBookable">
          <input
            id="isBookable"
            name="isBookable"
            type="checkbox"
            defaultChecked={category?.isBookable ?? true}
          />{" "}
          Bookable (unchecked = quote-only, like Winter Tours: hides the cancellation policy
          and swaps the tour-detail booking widget for a &quot;contact us for a quote&quot;
          notice)
        </label>
      </div>

      <Button variant="primary" type="submit">
        {submitting ? "Saving…" : category ? "Save changes" : "Create category"}
      </Button>
      {error && <Text size="sm">{error}</Text>}
    </form>
  );
}
