"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

export function StyleGuideInputDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      id="style-guide-input-demo"
      label="Example input"
      value={value}
      onChange={setValue}
      placeholder="you@example.com"
    />
  );
}
