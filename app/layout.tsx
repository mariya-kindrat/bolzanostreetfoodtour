import type { Metadata } from "next";
import { Fraunces, IM_Fell_English, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const fell = IM_Fell_English({
  variable: "--font-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bolzano Street Food Tour",
  description: "Guided street food tours through Bolzano's historic center",
};

// ClerkProvider is scoped to app/admin/layout.tsx, not the root layout: the
// public marketing site has no Clerk dependency (only /admin does), so it
// isn't affected by Clerk configuration/availability. See
// https://clerk.com/docs/reference/nextjs/errors/auth-was-called.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${fell.variable}`}>
      <body>{children}</body>
    </html>
  );
}
