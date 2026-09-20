"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const tour = useSearchParams().get("tour");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the element synchronously: React nulls e.currentTarget once the
    // handler returns, so it is unusable after the await below.
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message"),
      }),
    });
    setStatus(res.ok ? "success" : "error");
    if (res.ok) formEl.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="contact-name">Name</label>
      <input id="contact-name" name="name" type="text" required />

      <label htmlFor="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" required />

      <label htmlFor="contact-subject">Subject</label>
      <input
        key={tour}
        id="contact-subject"
        name="subject"
        type="text"
        defaultValue={tour ? `Inquiry: ${tour}` : undefined}
      />

      <label htmlFor="contact-message">Message</label>
      <textarea id="contact-message" name="message" required />

      <Button variant="primary" type="submit">
        Submit
      </Button>
      {status === "success" && <Text size="sm">Thanks — we&apos;ll be in touch soon.</Text>}
      {status === "error" && <Text size="sm">Something went wrong. Please try again.</Text>}
    </form>
  );
}
