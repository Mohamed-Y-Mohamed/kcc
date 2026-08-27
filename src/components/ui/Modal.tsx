"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleSo?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  titleSo,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // Esc closes one level; Tab cycles inside the panel rather than escaping to
  // the page behind it.
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the panel itself, so the reader announces the title first.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open, onKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6">
      <div
        className="fixed inset-0 bg-qaxwo/70 backdrop-blur-sm animate-[rise_0.2s_ease-out_both]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative z-10 my-auto w-full bg-surface-raised shadow-[var(--shadow-raised)] outline-none",
          "rounded-t-[6px] sm:rounded-[4px] border border-line",
          "animate-[rise_0.25s_var(--ease-out-soft)_both]",
          SIZES[size]
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-ink">{titleSo ?? title}</h2>
            {titleSo && <p className="translation mt-0.5">{title}</p>}
            {description && (
              <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-m-2 shrink-0 p-2 text-ink-subtle transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="max-h-[65vh] overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

/**
 * Reserved for genuinely irreversible things. Reversible actions get an undo
 * toast instead — a confirm on every delete just teaches people to click through.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "Tirtir · Delete",
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Ka noqo · Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
    </Modal>
  );
}
