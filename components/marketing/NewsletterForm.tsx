"use client";

import { useState } from "react";
import styles from "@/components/marketing/NewsletterForm.module.css";

type Status = "idle" | "sending" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success"
      ? "Thanks — you're signed up."
      : status === "error"
        ? "Something went wrong. Please try again."
        : "";

  return (
    <div className={styles.form}>
      {status !== "success" && (
        <form onSubmit={handleSubmit}>
          <div className={styles.pill}>
            <label htmlFor="newsletter-email" className={styles.srOnly}>
              Join our newsletter
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={styles.input}
            />
            <button type="submit" disabled={status === "sending"} className={styles.button}>
              Sign up
            </button>
          </div>
        </form>
      )}
      {/* Always mounted: screen readers announce text changes in an existing live region,
          not a region that appears already filled. */}
      <p role="status" className={styles.message}>
        {message}
      </p>
    </div>
  );
}
