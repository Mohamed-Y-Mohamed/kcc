"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Users as UsersIcon,
} from "lucide-react";
import { getRoom } from "@/lib/rooms";
import {
  BookingError,
  checkAvailability,
  createBooking,
  type Availability,
} from "@/lib/bookings";
import { addDaysISO, formatDate, formatPrice, nightsBetween, todayISO } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { SITE } from "@/lib/site";
import type { Booking, Room } from "@/lib/types";
import { Container, Section } from "@/components/ui/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export default function RoomPage() {
  return (
    <Suspense fallback={<LoadingBlock label="Loading room" />}>
      <RoomDetail />
    </Suspense>
  );
}

function RoomDetail() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [room, setRoom] = useState<Room | null | "missing">(null);
  const [activeImage, setActiveImage] = useState(0);

  const [checkIn, setCheckIn] = useState(search.get("checkIn") || todayISO());
  const [checkOut, setCheckOut] = useState(
    search.get("checkOut") || addDaysISO(todayISO(), 1)
  );
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<Availability | null>(null);

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const nights = nightsBetween(checkIn, checkOut);
  const datesValid = nights >= 1;

  useEffect(() => {
    if (!params?.id) return;
    getRoom(params.id)
      .then((r) => setRoom(r ?? "missing"))
      .catch(() => setRoom("missing"));
  }, [params?.id]);

  // Prefill from the signed-in profile — a guest should never retype what we
  // already know about them.
  useEffect(() => {
    if (!profile && !user) return;
    setForm((f) => ({
      ...f,
      guestName: f.guestName || profile?.displayName || "",
      guestEmail: f.guestEmail || user?.email || "",
      guestPhone: f.guestPhone || profile?.phone || "",
    }));
  }, [profile, user]);

  const refresh = useCallback(async () => {
    if (!room || room === "missing" || !datesValid) return;
    try {
      setAvailability(await checkAvailability(room, checkIn, checkOut));
    } catch (err) {
      console.error(err);
      setAvailability(null);
    }
  }, [room, checkIn, checkOut, datesValid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function onCheckInChange(value: string) {
    setCheckIn(value);
    if (value >= checkOut) setCheckOut(addDaysISO(value, 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!room || room === "missing") return;
    setError("");

    if (!form.guestName.trim()) {
      setError("We need a name to put the booking under.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.guestEmail.trim())) {
      setError("Add an email address so we can send you the details.");
      return;
    }
    if (form.guestPhone.trim().length < 6) {
      setError("Add a phone number — we confirm every booking by phone.");
      return;
    }

    setSubmitting(true);
    try {
      // Never optimistic: a room is real money, so we wait for the write.
      const booking = await createBooking({
        room,
        checkIn,
        checkOut,
        guests,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        notes: form.notes,
        userId: user?.uid ?? null,
      });
      setConfirmed(booking);
      toast("Booking received. We'll ring you to confirm.", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof BookingError
          ? err.message
          : "Couldn't save the booking. Check your connection and try again."
      );
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (room === null) return <LoadingBlock label="Loading room" />;

  if (room === "missing") {
    return (
      <Section>
        <Container size="narrow">
          <EmptyState
            icon={BedDouble}
            title="That room isn't here"
            description="It may have been removed. Have a look at what's available now."
            action={<ButtonLink href="/hotel">All rooms</ButtonLink>}
          />
        </Container>
      </Section>
    );
  }

  if (confirmed) return <Confirmation booking={confirmed} room={room} />;

  const soldOut = availability !== null && !availability.available;
  const total = nights * room.pricePerNight;

  return (
    <Section tone="surface">
      <Container>
        <Link
          href="/hotel"
          className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-subtle transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All rooms
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
          {/* Detail */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface-sunken">
              {room.images.length > 0 ? (
                <Image
                  src={room.images[activeImage] ?? room.images[0]}
                  alt={room.nameEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="woven h-full w-full" aria-hidden />
              )}
            </div>

            {room.images.length > 1 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {room.images.map((src, i) => (
                  <li key={`${src}-${i}`}>
                    <button
                      onClick={() => setActiveImage(i)}
                      aria-label={`Show image ${i + 1}`}
                      aria-current={i === activeImage}
                      className={cn(
                        "relative block h-16 w-20 overflow-hidden rounded-[2px] border transition-colors",
                        i === activeImage
                          ? "border-accent-solid"
                          : "border-line hover:border-line-strong"
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <header className="mt-8">
              <h1 className="font-display text-4xl leading-tight text-ink">
                {room.nameSo}
              </h1>
              <p className="translation mt-1.5">{room.nameEn}</p>
              <XawaashRule width="short" className="mt-4" />
            </header>

            <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-line py-6 sm:grid-cols-4">
              <Fact icon={UsersIcon} label="Sleeps" value={String(room.capacity)} />
              <Fact
                icon={BedDouble}
                label="Beds"
                value={String(room.beds)}
              />
              <Fact
                icon={Clock}
                label="Check in / out"
                value={`${room.checkInTime} / ${room.checkOutTime}`}
              />
              <Fact
                icon={MapPin}
                label="Where"
                value={room.location || SITE.address.street}
              />
            </dl>

            {(room.descriptionSo || room.descriptionEn) && (
              <div className="mt-8 flex flex-col gap-4">
                {room.descriptionSo && (
                  <p className="max-w-prose text-base leading-relaxed text-ink">
                    {room.descriptionSo}
                  </p>
                )}
                {room.descriptionEn && (
                  <p className="max-w-prose text-base leading-relaxed text-ink-muted">
                    {room.descriptionEn}
                  </p>
                )}
              </div>
            )}

            {room.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl text-ink">Waxa ku jira</h2>
                <p className="translation mt-1">What&apos;s included</p>
                <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 text-sm text-ink-muted"
                    >
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Booking */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-5 border border-line bg-surface-raised p-6"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="tnum text-2xl leading-none text-accent">
                    {formatPrice(room.pricePerNight)}
                  </p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
                    per night
                  </p>
                </div>
                {availability && !soldOut && (
                  <Badge tone="success">{availability.remaining} free</Badge>
                )}
                {soldOut && <Badge tone="danger">Fully booked</Badge>}
              </div>

              {error && <ErrorNote message={error} />}

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="translation">Check in</span>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayISO()}
                    onChange={(e) => onCheckInChange(e.target.value)}
                    className="h-11 rounded-[2px] border border-line bg-surface px-3 text-sm text-ink"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="translation">Check out</span>
                  <input
                    type="date"
                    value={checkOut}
                    min={addDaysISO(checkIn, 1)}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-11 rounded-[2px] border border-line bg-surface px-3 text-sm text-ink"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="translation">Guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-11 rounded-[2px] border border-line bg-surface px-3 text-sm text-ink"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    )
                  )}
                </select>
              </label>

              {datesValid && (
                <dl className="flex flex-col gap-2 border-y border-line py-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">
                      {formatPrice(room.pricePerNight)} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </dt>
                    <dd className="tnum text-ink">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-2">
                    <dt className="font-medium text-ink">Total</dt>
                    <dd className="tnum text-lg text-accent">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>
              )}

              <Input
                label="Your name"
                labelSo="Magacaaga"
                value={form.guestName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestName: e.target.value }))
                }
                autoComplete="name"
                required
              />
              <Input
                label="Email"
                labelSo="Iimayl"
                type="email"
                value={form.guestEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestEmail: e.target.value }))
                }
                autoComplete="email"
                required
              />
              <Input
                label="Phone"
                labelSo="Telefoon"
                type="tel"
                value={form.guestPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestPhone: e.target.value }))
                }
                autoComplete="tel"
                hint="We ring every booking to confirm it."
                required
              />
              <Textarea
                label="Anything we should know?"
                labelSo="Wax kale?"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
              />

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                disabled={soldOut || !datesValid}
              >
                {soldOut
                  ? "Fully booked for these dates"
                  : !datesValid
                  ? "Pick a later check-out"
                  : "Request this room"}
              </Button>

              {!user && (
                <p className="text-xs leading-relaxed text-ink-subtle">
                  Booking as a guest.{" "}
                  <Link
                    href="/signup"
                    className="text-accent underline underline-offset-2"
                  >
                    Create an account
                  </Link>{" "}
                  to keep all your bookings in one place.
                </p>
              )}
            </form>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-subtle">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

function Confirmation({ booking, room }: { booking: Booking; room: Room }) {
  const { user } = useAuth();

  return (
    <Section tone="surface">
      <Container size="narrow">
        <div className="border border-line bg-surface-raised p-8 sm:p-10">
          <CheckCircle2 className="h-9 w-9 text-success" strokeWidth={1.5} />
          <h1 className="mt-5 font-display text-4xl leading-tight text-ink">
            Waa la helay
          </h1>
          <p className="translation mt-1.5">We&apos;ve got your booking</p>
          <XawaashRule width="short" className="mt-4" />

          <p className="mt-6 text-base leading-relaxed text-ink-muted">
            Someone will ring you on{" "}
            <span className="tnum text-ink">{booking.guestPhone}</span> to
            confirm. Nothing to pay now.
          </p>

          <div className="mt-8 border border-accent-solid/40 bg-accent-solid/5 p-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-subtle">
              Your reference
            </p>
            <p className="tnum mt-2 text-3xl text-accent">{booking.code}</p>
            <p className="mt-2 text-xs text-ink-muted">
              Write this down — quote it when you call or arrive.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-line py-6">
            <div>
              <dt className="translation">Room</dt>
              <dd className="mt-1 text-ink">{room.nameEn}</dd>
            </div>
            <div>
              <dt className="translation">Guests</dt>
              <dd className="tnum mt-1 text-ink">{booking.guests}</dd>
            </div>
            <div>
              <dt className="translation">Check in</dt>
              <dd className="mt-1 text-ink">
                {formatDate(booking.checkIn)}
                <span className="tnum block text-xs text-ink-subtle">
                  from {room.checkInTime}
                </span>
              </dd>
            </div>
            <div>
              <dt className="translation">Check out</dt>
              <dd className="mt-1 text-ink">
                {formatDate(booking.checkOut)}
                <span className="tnum block text-xs text-ink-subtle">
                  by {room.checkOutTime}
                </span>
              </dd>
            </div>
            <div>
              <dt className="translation">Nights</dt>
              <dd className="tnum mt-1 text-ink">{booking.nights}</dd>
            </div>
            <div>
              <dt className="translation">Total on arrival</dt>
              <dd className="tnum mt-1 text-lg text-accent">
                {formatPrice(booking.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <ButtonLink href="/account">See my bookings</ButtonLink>
            ) : (
              <ButtonLink href="/signup">
                Create an account to track it
              </ButtonLink>
            )}
            <ButtonLink href="/hotel" variant="secondary">
              Back to rooms
            </ButtonLink>
            <ButtonLink
              href={`tel:${SITE.phone.e164}`}
              variant="ghost"
            >
              Call {SITE.phone.display}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
