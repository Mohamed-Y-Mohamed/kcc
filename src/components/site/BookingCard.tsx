"use client";

import React from "react";
import { BedDouble, CalendarX2, Clock } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";
import { canGuestCancel } from "@/lib/bookings";
import type { Booking } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/ui/Badge";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

export function BookingCard({
  booking,
  onCancel,
  cancelling,
  muted = false,
}: {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  cancelling?: boolean;
  /** Past and cancelled stays sit back so the live ones read first. */
  muted?: boolean;
}) {
  const cancellable = onCancel && canGuestCancel(booking);

  return (
    <li
      className={cn(
        "border bg-surface-raised p-5 sm:p-6",
        muted ? "border-line/70 opacity-80" : "border-line"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-display text-xl text-ink">
            <BedDouble className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {booking.roomName}
          </h3>
          <p className="mt-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            Ref {booking.code}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="translation">Check in</dt>
          <dd className="mt-0.5 text-ink">{formatDate(booking.checkIn)}</dd>
        </div>
        <div>
          <dt className="translation">Check out</dt>
          <dd className="mt-0.5 text-ink">{formatDate(booking.checkOut)}</dd>
        </div>
        <div>
          <dt className="translation">
            {booking.nights} {booking.nights === 1 ? "night" : "nights"}
          </dt>
          <dd className="mt-0.5 tnum text-ink">
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </dd>
        </div>
        <div>
          <dt className="translation">Total</dt>
          <dd className="mt-0.5 tnum text-accent">
            {formatPrice(booking.total)}
          </dd>
        </div>
      </dl>

      {booking.notes && (
        <p className="mt-4 border-l-2 border-line pl-3 text-sm text-ink-muted">
          {booking.notes}
        </p>
      )}

      {booking.status === "pending" && (
        <p className="mt-4 flex items-start gap-2 border-l-2 border-accent-solid bg-accent-solid/5 px-3 py-2.5 text-xs leading-relaxed text-ink-muted">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
          We&apos;ll ring you to confirm. Nothing to pay until you arrive.
        </p>
      )}

      {onCancel && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          {cancellable ? (
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              onClick={() => onCancel(booking)}
            >
              <CalendarX2 className="h-3.5 w-3.5" />
              Cancel this booking
            </Button>
          ) : (
            <p className="text-xs text-ink-subtle">
              This stay can&apos;t be cancelled online. Call{" "}
              <a
                href={`tel:${SITE.phone.e164}`}
                className="tnum text-accent underline underline-offset-2"
              >
                {SITE.phone.display}
              </a>{" "}
              and quote {booking.code}.
            </p>
          )}
        </div>
      )}
    </li>
  );
}
