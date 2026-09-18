"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;

    let res: Response;
    try {
      res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
      {error && <p style={{ color: "var(--color-terracotta-dark)" }}>{error}</p>}
    </>
  );
}
