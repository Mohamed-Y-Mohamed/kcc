import React from "react";
import { cn } from "@/lib/cn";

/**
 * The site's bilingual pairing, in one place so it reads the same everywhere:
 * Somali leads, English follows as a mono translation label.
 *
 * `Bi` stacks them (headings, labels, nav). `BiInline` puts them on one line
 * separated by a middot, for tight spots like table headers and chips.
 */
export function Bi({
  so,
  en,
  className,
  size = "md",
}: {
  so: string;
  en: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const lead = {
    sm: "text-sm",
    md: "text-base",
    lg: "font-display text-xl",
  }[size];

  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className={lead}>{so}</span>
      <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] opacity-65">
        {en}
      </span>
    </span>
  );
}

export function BiInline({
  so,
  en,
  className,
}: {
  so: string;
  en: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {so}
      <span className="opacity-55"> · {en}</span>
    </span>
  );
}
