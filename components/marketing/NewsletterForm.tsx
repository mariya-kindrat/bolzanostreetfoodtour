"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "success" : "error");
    if (res.ok) setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}
    >
      <Input
        id="newsletter-email"
        label="Join our newsletter"
        type="email"
        required
        value={email}
        onChange={setEmail}
        placeholder="Email address"
      />
      <Button variant="primary" type="submit">
        Sign up
      </Button>
      {status === "success" && <Text size="sm">Thanks — you&apos;re signed up.</Text>}
      {status === "error" && <Text size="sm">Something went wrong. Please try again.</Text>}
    </form>
  );
}
