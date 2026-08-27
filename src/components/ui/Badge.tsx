import React from "react";
import {
  BadgeCheck,
  Briefcase,
  CircleDot,
  Clock3,
  ConciergeBell,
  Crown,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ROLE_META } from "@/lib/roles";
import type { BookingStatus, MessageStatus, Role } from "@/lib/types";

export function Badge({
  children,
  tone = "neutral",
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "danger" | "deep";
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const tones = {
    neutral: "border-line-strong text-ink-muted",
    accent: "border-accent-solid/50 text-accent",
    success: "border-success/50 text-success",
    danger: "border-danger/50 text-danger",
    deep: "border-deep/50 text-deep",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[2px] border px-2 py-0.5",
        "font-mono text-[0.65rem] uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}

// Colour alone is invisible to roughly one in twelve people, so every status
// carries an icon and a word as well.
const BOOKING_STATUS = {
  pending: { label: "Pending", tone: "accent", icon: Clock3 },
  confirmed: { label: "Confirmed", tone: "success", icon: BadgeCheck },
  cancelled: { label: "Cancelled", tone: "danger", icon: XCircle },
  completed: { label: "Completed", tone: "neutral", icon: CircleDot },
} as const;

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const s = BOOKING_STATUS[status] ?? BOOKING_STATUS.pending;
  return (
    <Badge tone={s.tone} icon={s.icon}>
      {s.label}
    </Badge>
  );
}

const ROLE_STYLE = {
  owner: { tone: "accent", icon: Crown },
  admin: { tone: "deep", icon: ShieldCheck },
  manager: { tone: "deep", icon: Briefcase },
  staff: { tone: "neutral", icon: ConciergeBell },
  user: { tone: "neutral", icon: User },
} as const;

export function RoleBadge({ role }: { role: Role }) {
  const style = ROLE_STYLE[role] ?? ROLE_STYLE.user;
  return (
    <Badge tone={style.tone} icon={style.icon}>
      {ROLE_META[role]?.label ?? "Customer"}
    </Badge>
  );
}

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const map = {
    new: { label: "New", tone: "accent" },
    read: { label: "Read", tone: "neutral" },
    archived: { label: "Archived", tone: "neutral" },
  } as const;
  const s = map[status] ?? map.new;
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
