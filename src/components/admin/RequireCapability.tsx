"use client";

import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_META, type Capability } from "@/lib/roles";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Page-level gate. The sidebar already hides links a role cannot use, but
 * hiding a link is not a control — someone can still type the URL. This is the
 * client-side half; `firestore.rules` is the half that actually enforces it.
 */
export function RequireCapability({
  capability,
  children,
}: {
  capability: Capability;
  children: React.ReactNode;
}) {
  const { can, role } = useAuth();

  if (can(capability)) return <>{children}</>;

  return (
    <div className="flex max-w-lg flex-col items-start gap-4 border border-line bg-surface-raised p-8">
      <Lock className="h-7 w-7 text-ink-subtle" strokeWidth={1.5} />
      <div>
        <h1 className="font-display text-2xl text-ink">
          Not part of your role
        </h1>
        <p className="translation mt-1.5">Access restricted</p>
      </div>
      <p className="text-sm leading-relaxed text-ink-muted">
        You&apos;re signed in as{" "}
        <span className="font-medium text-ink">{ROLE_META[role].label}</span>.{" "}
        {ROLE_META[role].summary} Ask the owner if you need more.
      </p>
      <ButtonLink href="/admin" variant="secondary" size="sm">
        Back to the overview
      </ButtonLink>
    </div>
  );
}
