"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  CalendarCheck,
  Clock3,
  Mail,
  Sprout,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_META } from "@/lib/roles";
import { listBookings } from "@/lib/bookings";
import { listMenuItems } from "@/lib/menu";
import { listRooms } from "@/lib/rooms";
import { listUsers } from "@/lib/users";
import { listMessages } from "@/lib/messages";
import { seedStarterRooms } from "@/lib/seed";
import { formatDate, formatPrice, todayISO } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { AdminHeader, StatCard, TableWrap, Td, Th } from "@/components/admin/Shell";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

interface Stats {
  bookings: Booking[];
  rooms: number;
  menuItems: number;
  users: number;
  newMessages: number;
}

export default function AdminOverview() {
  const { toast } = useToast();
  const { can, role, profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setError("");
    // Staff can read bookings but not the user list, so one refusal must not
    // blank the whole dashboard — settle each read independently.
    const [bookings, rooms, menuItems, users, messages] =
      await Promise.allSettled([
        can("manageBookings") ? listBookings() : Promise.resolve([]),
        listRooms(),
        listMenuItems(),
        can("manageUsers") ? listUsers() : Promise.resolve([]),
        can("manageMessages") ? listMessages() : Promise.resolve([]),
      ]);

    const value = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
      r.status === "fulfilled" ? r.value : fallback;

    if ([bookings, rooms, menuItems].every((r) => r.status === "rejected")) {
      console.error("[KCC] dashboard reads failed", bookings, rooms, menuItems);
      setError(
        "Couldn't read from Firestore. Check that the database exists and firestore.rules has been deployed."
      );
      setStats(null);
      return;
    }

    setStats({
      bookings: value(bookings, [] as Booking[]),
      rooms: value(rooms, []).length,
      menuItems: value(menuItems, []).length,
      users: value(users, []).length,
      newMessages: value(messages, []).filter((m) => m.status === "new").length,
    });
  }, [can]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSeed() {
    setSeeding(true);
    try {
      const result = await seedStarterRooms();
      toast(
        result.skipped
          ? "You already have rooms — nothing was changed."
          : `Added ${result.rooms} room types. Edit them under Rooms.`,
        result.skipped ? "info" : "success"
      );
      await load();
    } catch (err) {
      console.error(err);
      toast("Couldn't add the starter rooms. Check your rules.", "error");
    } finally {
      setSeeding(false);
    }
  }

  if (!stats && !error) return <LoadingBlock label="Loading the dashboard" />;

  const today = todayISO();
  const upcoming = (stats?.bookings ?? [])
    .filter((b) => b.checkOut >= today && b.status !== "cancelled")
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const pending = (stats?.bookings ?? []).filter((b) => b.status === "pending");
  const revenue = (stats?.bookings ?? [])
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.total, 0);

  // The menu came across with the import, so only the hotel side can be blank.
  const needsRooms = stats !== null && stats.rooms === 0;

  return (
    <div className="flex flex-col gap-8">
      <AdminHeader
        title="Overview"
        titleSo="Guudmar"
        descriptionSo={`Salaan ${profile?.displayName?.split(" ")[0] || "sahib"} — waxaad tahay ${ROLE_META[role].labelSo}.`}
        description={`Signed in as ${ROLE_META[role].label}. ${ROLE_META[role].summary}`}
        actions={
          can("manageBookings") && (
            <ButtonLink href="/admin/bookings" size="sm" variant="secondary">
              All bookings
            </ButtonLink>
          )
        }
      />

      {error && <ErrorNote message={error} />}

      {needsRooms && can("seedContent") && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-accent-solid/40 bg-accent-solid/5 p-5">
          <div className="flex items-start gap-3">
            <Sprout className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-display text-lg text-ink">
                Weli qolal ma jiraan
              </p>
              <p className="translation mt-1">No rooms yet</p>
              <p className="mt-2 max-w-prose text-sm text-ink-muted">
                The hotel page is empty until rooms exist. Load three starter
                room types — single, double and family — then edit the prices,
                photos and descriptions to match. Nothing existing is touched.
              </p>
            </div>
          </div>
          <Button onClick={onSeed} loading={seeding}>
            Ku dar qolal · Add starter rooms
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          labelSo="Sugaya xaqiijin"
          label="Awaiting confirmation"
          value={pending.length}
          sub={pending.length ? "Needs a call back" : "All caught up"}
          icon={Clock3}
          tone={pending.length ? "accent" : "neutral"}
        />
        <StatCard
          labelSo="Marti soo socda"
          label="Upcoming stays"
          value={upcoming.length}
          sub="Checking out today or later"
          icon={CalendarCheck}
        />
        <StatCard
          labelSo="Dakhliga la xaqiijiyay"
          label="Confirmed revenue"
          value={formatPrice(revenue)}
          sub="Confirmed and completed bookings"
          icon={BedDouble}
          tone="deep"
        />
        <StatCard
          labelSo="Fariimo cusub"
          label="New messages"
          value={stats?.newMessages ?? 0}
          sub={stats?.newMessages ? "Unread enquiries" : "Inbox clear"}
          icon={Mail}
          tone={stats?.newMessages ? "accent" : "neutral"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {can("manageRooms") && (
          <QuickLink
            href="/admin/rooms"
            icon={BedDouble}
            titleSo="Qolalka"
            title="Rooms"
            value={stats?.rooms ?? 0}
            label="room types"
          />
        )}
        {can("manageMenu") && (
          <QuickLink
            href="/admin/menu"
            icon={UtensilsCrossed}
            titleSo="Cunto & Cabitaan"
            title="Food & drink"
            value={stats?.menuItems ?? 0}
            label="items on the menu"
          />
        )}
        {can("manageUsers") && (
          <QuickLink
            href="/admin/users"
            icon={Users}
            titleSo="Isticmaalayaal"
            title="Users"
            value={stats?.users ?? 0}
            label="registered accounts"
          />
        )}
      </div>

      <section>
        <h2 className="font-display text-2xl text-ink">Marti soo socda</h2>
        <p className="translation mt-1">Next arrivals</p>

        <div className="mt-5">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No upcoming stays"
              description="New bookings from the website land here straight away."
              action={<ButtonLink href="/hotel">View the hotel page</ButtonLink>}
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Guest</Th>
                  <Th>Room</Th>
                  <Th>Check in</Th>
                  <Th>Check out</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 8).map((b) => (
                  <tr key={b.id} className="hover:bg-surface-sunken">
                    <Td>
                      <span className="block font-medium">{b.guestName}</span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-subtle">
                        {b.code}
                      </span>
                    </Td>
                    <Td>{b.roomName}</Td>
                    <Td className="tnum whitespace-nowrap">
                      {formatDate(b.checkIn)}
                    </Td>
                    <Td className="tnum whitespace-nowrap">
                      {formatDate(b.checkOut)}
                    </Td>
                    <Td className="tnum">{formatPrice(b.total)}</Td>
                    <Td>
                      <BookingStatusBadge status={b.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  titleSo,
  value,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  titleSo: string;
  value: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border border-line bg-surface-raised p-5 transition-colors hover:border-accent-solid"
    >
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <div className="min-w-0">
        <p className="font-display text-lg text-ink">{titleSo}</p>
        <p className="translation mt-0.5">{title}</p>
        <p className="mt-1.5 text-xs text-ink-subtle">
          <span className="tnum text-ink-muted">{value}</span> {label}
        </p>
      </div>
    </Link>
  );
}
