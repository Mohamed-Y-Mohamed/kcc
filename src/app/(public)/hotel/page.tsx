"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  Clock,
  MapPin,
  Users as UsersIcon,
} from "lucide-react";
import { listActiveRooms } from "@/lib/rooms";
import { checkAvailability, type Availability } from "@/lib/bookings";
import {
  addDaysISO,
  formatPrice,
  nightsBetween,
  todayISO,
} from "@/lib/format";
import type { Room } from "@/lib/types";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, Skeleton } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { SITE } from "@/lib/site";

export default function HotelPage() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 1));
  const [availability, setAvailability] = useState<Record<string, Availability>>(
    {}
  );
  const [checking, setChecking] = useState(false);

  const nights = nightsBetween(checkIn, checkOut);
  const datesValid = nights >= 1;

  useEffect(() => {
    listActiveRooms()
      .then(setRooms)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load the rooms. Refresh the page to try again.");
        setRooms([]);
      });
  }, []);

  const refreshAvailability = useCallback(async () => {
    if (!rooms || !datesValid) return;
    setChecking(true);
    try {
      const entries = await Promise.all(
        rooms.map(
          async (room) =>
            [room.id, await checkAvailability(room, checkIn, checkOut)] as const
        )
      );
      setAvailability(Object.fromEntries(entries));
    } catch (err) {
      console.error(err);
      // Availability is a nicety — the room list still works without it.
      setAvailability({});
    } finally {
      setChecking(false);
    }
  }, [rooms, checkIn, checkOut, datesValid]);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  // Keep check-out ahead of check-in rather than letting someone submit
  // a negative stay and get told off afterwards.
  function onCheckInChange(value: string) {
    setCheckIn(value);
    if (value >= checkOut) setCheckOut(addDaysISO(value, 1));
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-roasted text-bone">
        <div className="woven absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-roasted via-roasted/95 to-shaash/50"
          aria-hidden
        />
        <Container className="relative">
          <div className="max-w-2xl py-24 sm:py-32">
            <p className="eyebrow text-xawaash">Hoteelka KCC</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] text-bone">
              Qol lagu seexdo
            </h1>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ciid/70">
              A room for the night
            </p>
            <XawaashRule className="mt-5 max-w-xs text-xawaash" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ciid/85">
              Rooms above the cafe on {SITE.address.street}. Pick your dates,
              choose a room, and you&apos;re done — no account needed.
            </p>
          </div>
        </Container>
      </section>

      {/* Date bar */}
      <div className="sticky top-[72px] z-40 border-y border-line bg-surface-raised/95 backdrop-blur-md">
        <Container>
          <div className="flex flex-wrap items-end gap-4 py-4">
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
            <p className="pb-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
              {datesValid
                ? `${nights} ${nights === 1 ? "night" : "nights"}`
                : "Pick a later check-out"}
              {checking && " · checking…"}
            </p>
          </div>
        </Container>
      </div>

      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Qolalka"
            so="Qolalkayaga"
            en="Our rooms"
            lead="Prices are per night for the whole room, not per person."
          />

          {error && (
            <div className="mt-8">
              <ErrorNote message={error} />
            </div>
          )}

          <div className="mt-12">
            {rooms === null ? (
              <div className="flex flex-col gap-6">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <EmptyState
                icon={BedDouble}
                title="No rooms listed yet"
                description={`We're setting the rooms up online. Call ${SITE.phone.display} and we'll book you in directly.`}
                action={
                  <ButtonLink href={`tel:${SITE.phone.e164}`}>
                    Call the hotel
                  </ButtonLink>
                }
              />
            ) : (
              <ul className="flex flex-col gap-8">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    availability={availability[room.id]}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    nights={nights}
                    datesValid={datesValid}
                  />
                ))}
              </ul>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function RoomCard({
  room,
  availability,
  checkIn,
  checkOut,
  nights,
  datesValid,
}: {
  room: Room;
  availability?: Availability;
  checkIn: string;
  checkOut: string;
  nights: number;
  datesValid: boolean;
}) {
  const soldOut = availability && !availability.available;
  const href = `/hotel/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}`;

  return (
    <li className="grid gap-0 border border-line bg-surface-raised md:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken md:aspect-auto">
        {room.images[0] ? (
          <Image
            src={room.images[0]}
            alt={room.nameEn}
            fill
            sizes="(max-width: 768px) 100vw, 352px"
            className="object-cover"
          />
        ) : (
          <div className="woven h-full w-full min-h-[14rem]" aria-hidden />
        )}
      </div>

      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-ink">{room.nameSo}</h3>
            <p className="translation mt-1">{room.nameEn}</p>
          </div>
          <div className="text-right">
            <p className="tnum text-2xl leading-none text-accent">
              {formatPrice(room.pricePerNight)}
            </p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
              per night
            </p>
          </div>
        </div>

        {room.descriptionEn && (
          <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
            {room.descriptionEn}
          </p>
        )}

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <li className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-accent" />
            Sleeps {room.capacity}
          </li>
          <li className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-accent" />
            {room.beds} {room.beds === 1 ? "bed" : "beds"}
          </li>
          {room.location && (
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {room.location}
            </li>
          )}
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <span className="tnum">
              In {room.checkInTime} · Out {room.checkOutTime}
            </span>
          </li>
        </ul>

        {room.amenities.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 6).map((a) => (
              <li key={a}>
                <Badge>{a}</Badge>
              </li>
            ))}
            {room.amenities.length > 6 && (
              <li>
                <Badge>+{room.amenities.length - 6} more</Badge>
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-line pt-5">
          {datesValid && availability && (
            <p
              className={`font-mono text-[0.65rem] uppercase tracking-[0.16em] ${
                soldOut ? "text-danger" : "text-success"
              }`}
            >
              {soldOut
                ? "Fully booked for these dates"
                : `${availability.remaining} of ${availability.total} free`}
            </p>
          )}

          {datesValid && !soldOut && (
            <p className="tnum text-sm text-ink-muted">
              {nights} {nights === 1 ? "night" : "nights"} ={" "}
              <span className="text-accent">
                {formatPrice(nights * room.pricePerNight)}
              </span>
            </p>
          )}

          <div className="ml-auto">
            {soldOut ? (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle underline underline-offset-4 hover:text-ink"
              >
                Try other dates
              </Link>
            ) : (
              <ButtonLink href={href}>
                Book this room
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
