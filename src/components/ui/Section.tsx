import React from "react";
import { cn } from "@/lib/cn";
import { XawaashRule } from "./XawaashRule";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        widths[size],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  tone = "surface",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "sunken" | "deep";
  id?: string;
}) {
  const tones = {
    surface: "bg-surface text-ink",
    sunken: "bg-surface-sunken text-ink",
    deep: "bg-deep-solid text-deep-ink",
  };
  return (
    <section
      id={id}
      className={cn("py-16 sm:py-24 lg:py-28", tones[tone], className)}
    >
      {children}
    </section>
  );
}

/**
 * The bilingual pairing used everywhere: Somali leads at display size, English
 * sits underneath as a mono translation label. It reflects how the business
 * actually speaks to its customers.
 */
export function SectionHeading({
  eyebrow,
  so,
  en,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  so: string;
  en: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        centered && "items-center text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
        {so}
      </h2>
      <p className="translation">{en}</p>
      <XawaashRule width="short" className={cn(centered && "mx-auto")} />
      {lead && (
        <p
          className={cn(
            "mt-1 max-w-prose text-base leading-relaxed text-ink-muted",
            centered && "mx-auto"
          )}
        >
          {lead}
        </p>
      )}
    </header>
  );
}
