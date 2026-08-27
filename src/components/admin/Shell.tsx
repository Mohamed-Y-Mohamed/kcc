import React from "react";
import { cn } from "@/lib/cn";

export function AdminHeader({
  title,
  titleSo,
  description,
  descriptionSo,
  actions,
}: {
  title: string;
  /** Somali leads at display size, matching the customer site. */
  titleSo?: string;
  description?: string;
  descriptionSo?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="font-display text-3xl leading-tight text-ink">
          {titleSo ?? title}
        </h1>
        {titleSo && <p className="translation mt-1.5">{title}</p>}
        {descriptionSo && (
          <p className="mt-3 max-w-prose text-sm text-ink">{descriptionSo}</p>
        )}
        {description && (
          <p className="mt-1.5 max-w-prose text-sm text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function StatCard({
  label,
  labelSo,
  value,
  sub,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  labelSo?: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "neutral" | "accent" | "deep";
}) {
  const tones = {
    neutral: "text-ink-subtle",
    accent: "text-accent",
    deep: "text-deep",
  };
  return (
    <div className="border border-line bg-surface-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          {labelSo && (
            <p className="text-sm leading-tight text-ink">{labelSo}</p>
          )}
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {label}
          </p>
        </div>
        <Icon className={cn("h-4 w-4 shrink-0", tones[tone])} />
      </div>
      <p className="tnum mt-3 text-3xl leading-none text-ink">{value}</p>
      {sub && <p className="mt-2 text-xs text-ink-subtle">{sub}</p>}
    </div>
  );
}

/** Tables must scroll inside their own box, never push the page sideways. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-line bg-surface-raised">
      <table className="w-full min-w-[44rem] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-line px-4 py-3 text-left",
        "font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ink-subtle",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-line/70 px-4 py-3 align-middle text-ink",
        className
      )}
    >
      {children}
    </td>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-6">{children}</div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <input
      type="search"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full min-w-0 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-subtle sm:w-72"
    />
  );
}
