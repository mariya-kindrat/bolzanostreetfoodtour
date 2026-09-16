import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <div>{children}</div>
    </ClerkProvider>
  );
}
