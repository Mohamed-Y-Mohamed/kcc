"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, Mail, Phone } from "lucide-react";
import { listBookings, setBookingStatus, updateBookingNotes } from "@/lib/bookings";
import { formatDate, formatPrice, formatTimestamp, todayISO } from "@/lib/format";
import { BOOKING_STATUSES, type Booking, type BookingStatus } from "@/lib/types";
import { AdminHeader, SearchInput, TableWrap, Td, Th, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { BookingStatusBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Range = "upcoming" | "today" | "past" | "all";

export default function AdminBookingsPage() {
  return (
    <RequireCapability capability="manageBookings">
      <BookingsPage />
    </RequireCapability>
  );
}

function BookingsPage() {
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [range, setRange] = useState<Range>("upcoming");

  const [open, setOpen] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setBookings(await listBookings());
    } catch (err) {
      console.error(err);
      setError("Couldn't load bookings. Check Firestore rules are deployed.");
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(booking: Booking, next: BookingStatus) {
    setBusy(true);
    try {
      await setBookingStatus(booking.id, next);
      toast(`${booking.code} marked ${next}.`, "success");
      setOpen((o) => (o && o.id === booking.id ? { ...o, status: next } : o));
      await load();
    } catch (err) {
      console.error(err);
      toast("Couldn't update that booking.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function saveNotes() {
    if (!open) return;
    setBusy(true);
    try {
      await updateBookingNotes(open.id, notes);
      toast("Note saved.", "success");
      await load();
    } catch {
      toast("Couldn't save the note.", "error");
    } finally {
      setBusy(false);
    }
  }

  const today = todayISO();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (bookings ?? []).filter((b) => {
      if (status && b.status !== status) return false;

      if (range === "upcoming" && b.checkOut < today) return false;
      if (range === "past" && b.checkOut >= today) return false;
      if (range === "today" && !(b.checkIn <= today && b.checkOut > today))
        return false;

      if (!q) return true;
      return (
        b.code.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.guestPhone.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q)
      );
    });
  }, [bookings, search, status, range, today]);

  const counts = useMemo(() => {
    const all = bookings ?? [];
    return {
      pending: all.filter((b) => b.status === "pending").length,
      staying: all.filter(
        (b) =>
          b.checkIn <= today && b.checkOut > today && b.status !== "cancelled"
      ).length,
    };
  }, [bookings, today]);

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Bookings"
        description={
          counts.pending
            ? `${counts.pending} waiting to be confirmed. ${counts.staying} guest${counts.staying === 1 ? "" : "s"} in the building right now.`
            : `Nothing waiting. ${counts.staying} guest${counts.staying === 1 ? "" : "s"} in the building right now.`
        }
      />

      <Toolbar>
        <SearchInput
          label="Search bookings"
          value={search}
          onChange={setSearch}
          placeholder="Code, name, email or phone…"
        />

        <div className="flex gap-1 rounded-[2px] border border-line p-0.5">
          {(["upcoming", "today", "past", "all"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-[2px] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors",
                range === r
                  ? "bg-accent-solid text-accent-ink"
                  : "text-ink-subtle hover:text-ink"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus | "")}
          aria-label="Filter by status"
          className="h-10 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink"
        >
          <option value="">Any status</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {bookings && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {filtered.length} of {bookings.length}
          </span>
        )}
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {bookings === null ? (
        <LoadingBlock label="Loading bookings" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={
            bookings.length === 0 ? "No bookings yet" : "Nothing in this view"
          }
          description={
            bookings.length === 0
              ? "Bookings made on the hotel page land here the moment a guest submits them."
              : "Try another range or clear the filters."
          }
        />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Ref</Th>
              <Th>Guest</Th>
              <Th>Room</Th>
              <Th>Dates</Th>
              <Th>Nights</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-surface-sunken">
                <Td className="font-mono text-xs whitespace-nowrap">{b.code}</Td>
                <Td>
                  <span className="block font-medium">{b.guestName}</span>
                  <span className="text-xs text-ink-subtle">
                    {b.userId ? "Account holder" : "Guest booking"}
                  </span>
                </Td>
                <Td className="text-sm">{b.roomName}</Td>
                <Td className="tnum whitespace-nowrap text-xs">
                  {formatDate(b.checkIn)}
                  <span className="mx-1 text-ink-subtle">→</span>
                  {formatDate(b.checkOut)}
                </Td>
                <Td className="tnum">{b.nights}</Td>
                <Td className="tnum whitespace-nowrap text-accent">
                  {formatPrice(b.total)}
                </Td>
                <Td>
                  <BookingStatusBadge status={b.status} />
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {b.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => changeStatus(b, "confirmed")}
                      >
                        Confirm
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setOpen(b);
                        setNotes(b.notes);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {/* Detail */}
      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        size="md"
        title={open ? `Booking ${open.code}` : "Booking"}
        footer={
          open && (
            <>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Close
              </Button>
              {open.status !== "cancelled" && (
                <Button
                  variant="danger"
                  loading={busy}
                  onClick={() => changeStatus(open, "cancelled")}
                >
                  Cancel booking
                </Button>
              )}
              {open.status === "pending" && (
                <Button loading={busy} onClick={() => changeStatus(open, "confirmed")}>
                  Confirm
                </Button>
              )}
              {open.status === "confirmed" && (
                <Button loading={busy} onClick={() => changeStatus(open, "completed")}>
                  Mark completed
                </Button>
              )}
            </>
          )
        }
      >
        {open && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <BookingStatusBadge status={open.status} />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-subtle">
                Booked {formatTimestamp(open.createdAt)}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
              <div>
                <dt className="translation">Guest</dt>
                <dd className="mt-0.5 text-ink">{open.guestName}</dd>
              </div>
              <div>
                <dt className="translation">Room</dt>
                <dd className="mt-0.5 text-ink">{open.roomName}</dd>
              </div>
              <div>
                <dt className="translation">Check in</dt>
                <dd className="mt-0.5 tnum text-ink">{formatDate(open.checkIn)}</dd>
              </div>
              <div>
                <dt className="translation">Check out</dt>
                <dd className="mt-0.5 tnum text-ink">
                  {formatDate(open.checkOut)}
                </dd>
              </div>
              <div>
                <dt className="translation">Guests</dt>
                <dd className="mt-0.5 tnum text-ink">{open.guests}</dd>
              </div>
              <div>
                <dt className="translation">
                  {open.nights} nights × {formatPrice(open.pricePerNight)}
                </dt>
                <dd className="mt-0.5 tnum text-accent">
                  {formatPrice(open.total)}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${open.guestPhone}`}
                className="inline-flex h-10 items-center gap-2 rounded-[2px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent-solid hover:text-accent"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="tnum">{open.guestPhone || "No phone"}</span>
              </a>
              <a
                href={`mailto:${open.guestEmail}`}
                className="inline-flex h-10 items-center gap-2 rounded-[2px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent-solid hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                {open.guestEmail}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                hint="Anything the guest asked for, or what you agreed on the phone."
              />
              <Button
                variant="secondary"
                size="sm"
                className="self-start"
                loading={busy}
                onClick={saveNotes}
              >
                Save note
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
