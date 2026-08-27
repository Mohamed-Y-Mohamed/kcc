import React from "react";
import { Container } from "@/components/ui/Section";
import { XawaashRule } from "@/components/ui/XawaashRule";

/** Shared frame for sign-in, sign-up and the admin door. */
export function AuthCard({
  so,
  en,
  lead,
  children,
  footer,
}: {
  so: string;
  en: string;
  lead?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-surface-sunken py-16 sm:py-24">
      <div className="woven absolute inset-0 opacity-40" aria-hidden />
      <Container size="narrow" className="relative">
        <div className="mx-auto max-w-md border border-line bg-surface-raised p-7 shadow-[var(--shadow-raised)] sm:p-9">
          <header className="flex flex-col gap-2.5">
            <h1 className="font-display text-3xl leading-tight text-ink">
              {so}
            </h1>
            <p className="translation">{en}</p>
            <XawaashRule width="short" />
            {lead && (
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {lead}
              </p>
            )}
          </header>

          <div className="mt-7">{children}</div>

          {footer && (
            <div className="mt-6 border-t border-line pt-5 text-sm text-ink-muted">
              {footer}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
