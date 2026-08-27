"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "deep"
  | "danger"
  | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent-solid text-accent-ink hover:brightness-108 active:brightness-95 border border-accent-solid",
  secondary:
    "bg-transparent text-ink border border-line-strong hover:border-accent-solid hover:text-accent",
  ghost:
    "bg-transparent text-ink-muted border border-transparent hover:text-ink hover:bg-surface-sunken",
  deep: "bg-deep-solid text-deep-ink border border-deep-solid hover:brightness-125",
  danger:
    "bg-transparent text-danger border border-danger/40 hover:bg-danger/10 hover:border-danger",
  // For the dark hero and deep bands, which stay dark in both themes. Passing
  // `text-bone` as a className instead loses the cascade to the variant's own
  // text colour and renders an invisible button.
  inverse:
    "bg-transparent text-bone border border-bone/35 hover:border-xawaash hover:text-xawaash",
};

// 44px minimum on md — the smallest reliable touch target.
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-[2px] font-sans font-medium tracking-wide " +
  "transition-[background-color,border-color,color,filter,transform] duration-200 " +
  "disabled:opacity-45 disabled:pointer-events-none select-none whitespace-nowrap " +
  "active:translate-y-px";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      // Stays enabled while merely loading so screen readers keep focus on it.
      disabled={disabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
