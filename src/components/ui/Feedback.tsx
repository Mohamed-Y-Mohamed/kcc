import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("h-5 w-5 animate-spin text-accent", className)}
      aria-hidden
    />
  );
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 py-16 text-sm text-ink-muted"
    >
      <Spinner />
      {label}
    </div>
  );
}

/**
 * Matches the shape of the real content so nothing shifts when it lands.
 *
 * `tone="inverse"` is for the panels that stay dark in both themes — the hero
 * board, mainly. Passing a background class in `className` does not work: it
 * loses the cascade to the base colour and paints a near-white slab on a dark
 * panel.
 */
export function Skeleton({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px]",
        tone === "inverse" ? "bg-caano/10" : "bg-surface-sunken",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r",
        "after:from-transparent after:to-transparent",
        tone === "inverse" ? "after:via-caano/15" : "after:via-line/60",
        "after:animate-[shimmer_1.6s_infinite]",
        className
      )}
      aria-hidden
    />
  );
}

/** An empty screen is an invitation to act, so it always offers the next step. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 border border-dashed border-line px-6 py-16 text-center",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
        <Icon className="h-5 w-5 text-ink-subtle" />
      </span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border-l-2 border-danger bg-danger/5 px-3 py-2.5 text-sm text-danger"
    >
      {message}
    </p>
  );
}
