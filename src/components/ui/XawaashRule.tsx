"use client";

import React, { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The site's signature mark: a woven band borrowed from Somali mat and basket
 * geometry — a centre thread, diamond knots, and the warp ticks between them.
 * It separates every section, so the motif is the thing you remember rather
 * than any one photograph.
 *
 * `width="short"` gives the centred version used under headings.
 */
export function XawaashRule({
  width = "full",
  className,
}: {
  width?: "full" | "short";
  className?: string;
}) {
  // Pattern ids are global — without this, two rules on one page collide and
  // the second renders empty.
  const id = `xawaash-${useId().replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden
      focusable="false"
      className={cn(
        "block h-3 text-accent-solid",
        width === "short" ? "w-28" : "w-full",
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width="24"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 6H24"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />
          <path
            d="M12 1.6 16.4 6 12 10.4 7.6 6Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M0.5 3.2V8.8M23.5 3.2V8.8"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
