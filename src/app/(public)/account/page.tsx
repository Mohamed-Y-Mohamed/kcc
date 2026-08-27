"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  History,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  BookingError,
  cancelOwnBooking,
  listBookingsForUser,
} from "@/lib/bookings";
import { updateOwnProfile } from "@/lib/users";
import { formatPrice, todayISO } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/Modal";
import { BookingCard } from "@/components/site/BookingCard";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Tab = "upcoming" | "previous" | "profile";

const TABS: { id: Tab; so: string; en: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "upcoming", so: "Socda", en: "Upcoming", icon: BedDouble },
  { id: "previous", so: "Hore", en: "Previous", icon: History },
  { id: "profile", so: "Xogtaada", en: "Profile", icon: UserRound },
];

export default function AccountPage() {
  const { user, profile, isStaff, loading, signOutUser, refreshProfile } =
    useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("upcoming");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    setError("");
    try {
      setBookings(await listBookingsForUser(user.uid));
    } catch (err) {
      console.error(err);
      setError("Couldn't load your bookings. Refresh the page to try again.");
      setBookings([]);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const today = todayISO();

  const { upcoming, previous } = useMemo(() => {
    const all = bookings ?? [];
    return {
      upcoming: all
        .filter((b) => b.checkOut >= today && b.status !== "cancelled")
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn)),
      previous: all
        .filter((b) => b.checkOut < today || b.status === "cancelled")
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn)),
    };
  }, [bookings, today]);

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelOwnBooking(cancelTarget);
      toast(`Booking ${cancelTarget.code} cancelled.`, "success");
      setCancelTarget(null);
      await load();
    } catch (err) {
      console.error(err);
      toast(
        err instanceof BookingError
          ? err.message
          : "Couldn't cancel that. Give us a ring and we'll do it.",
        "error"
      );
    } finally {
      setCancelling(false);
    }
  }

  // Arrow keys move between tabs, which is what a tablist is expected to do.
  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  if (loading || !user) return <LoadingBlock label="Loading your account" />;

  const firstName = profile?.displayName?.split(" ")[0] || "sahib";

  return (
    <Section tone="surface">
      <Container>
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
          <div>
            <p className="eyebrow">Akoonkaaga</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Salaan, {firstName}
            </h1>
            <p className="translation mt-1.5">Your account</p>
            <XawaashRule width="short" className="mt-3" />
          </div>

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/hotel" size="sm">
              Book a room
            </ButtonLink>
            {isStaff && (
              <ButtonLink href="/admin" variant="deep" size="sm">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </ButtonLink>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await signOutUser();
                toast("Signed out.", "info");
                router.push("/");
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Summary */}
        {bookings && bookings.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
            <Stat label="Upcoming" value={String(upcoming.length)} />
            <Stat label="Previous" value={String(previous.length)} />
            <Stat
              label="Nights booked"
              value={String(
                bookings
                  .filter((b) => b.status !== "cancelled")
                  .reduce((n, b) => n + b.nights, 0)
              )}
            />
            <Stat
              label="Spent with us"
              value={formatPrice(
                bookings
                  .filter(
                    (b) => b.status === "completed" || b.status === "confirmed"
                  )
                  .reduce((n, b) => n + b.total, 0)
              )}
            />
          </dl>
        )}

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Account sections"
          className="mt-10 flex gap-1 border-b border-line"
        >
          {TABS.map((t, i) => {
            const active = tab === t.id;
            const count =
              t.id === "upcoming"
                ? upcoming.length
                : t.id === "previous"
                ? previous.length
                : null;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={cn(
                  "-mb-px flex items-center gap-2 border-b-2 px-4 py-3 transition-colors",
                  active
                    ? "border-accent-solid text-ink"
                    : "border-transparent text-ink-subtle hover:text-ink"
                )}
              >
                <t.icon className="h-4 w-4" aria-hidden />
                <span className="font-display text-base">{t.so}</span>
                <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] opacity-70 sm:inline">
                  {t.en}
                </span>
                {count !== null && count > 0 && (
                  <span className="tnum rounded-[2px] bg-surface-sunken px-1.5 text-[0.65rem] text-ink-muted">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-6">
            <ErrorNote message={error} />
          </div>
        )}

        {/* Panels */}
        <div className="mt-8">
          {bookings === null && tab !== "profile" ? (
            <LoadingBlock label="Loading bookings" />
          ) : (
            <>
              <Panel id="upcoming" active={tab === "upcoming"}>
                {upcoming.length === 0 ? (
                  <EmptyState
                    icon={BedDouble}
                    title="Nothing booked yet"
                    description="When you book a room it shows up here with its reference code, and you can cancel it from this page."
                    action={<ButtonLink href="/hotel">Browse rooms</ButtonLink>}
                  />
                ) : (
                  <ul className="flex flex-col gap-4">
                    {upcoming.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={setCancelTarget}
                        cancelling={cancelling && cancelTarget?.id === b.id}
                      />
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel id="previous" active={tab === "previous"}>
                {previous.length === 0 ? (
                  <EmptyState
                    icon={History}
                    title="No past stays"
                    description="Finished and cancelled bookings are kept here so you've always got the record."
                  />
                ) : (
                  <ul className="flex flex-col gap-4">
                    {previous.map((b) => (
                      <BookingCard key={b.id} booking={b} muted />
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel id="profile" active={tab === "profile"}>
                <ProfileForm
                  email={user.email ?? ""}
                  displayName={profile?.displayName ?? ""}
                  phone={profile?.phone ?? ""}
                  onSave={async (patch) => {
                    await updateOwnProfile(user.uid, patch);
                    await refreshProfile();
                  }}
                />
              </Panel>
            </>
          )}
        </div>
      </Container>

      <ConfirmDialog
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        confirmLabel="Cancel booking"
        title={`Cancel ${cancelTarget?.code ?? "this booking"}?`}
        body={`This frees up the ${cancelTarget?.roomName ?? "room"} for those dates and can't be undone. You'd need to book again if you change your mind.`}
      />
    </Section>
  );
}

function Panel({
  id,
  active,
  children,
}: {
  id: string;
  active: boolean;
  children: React.ReactNode;
}) {
  if (!active) return null;
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`}>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-4">
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
        {label}
      </dt>
      <dd className="tnum mt-2 text-2xl leading-none text-ink">{value}</dd>
    </div>
  );
}

function ProfileForm({
  email,
  displayName,
  phone,
  onSave,
}: {
  email: string;
  displayName: string;
  phone: string;
  onSave: (patch: { displayName: string; phone: string }) => Promise<void>;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(displayName);
  const [tel, setTel] = useState(phone);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(displayName);
    setTel(phone);
  }, [displayName, phone]);

  const dirty = name !== displayName || tel !== phone;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ displayName: name.trim(), phone: tel.trim() });
      toast("Details saved.", "success");
    } catch {
      toast("Couldn't save your details. Try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl text-ink">Xogtaada</h2>
      <p className="translation mt-1">Your details</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        We use these to fill in booking forms for you and to reach you about a
        stay.
      </p>

      <form onSubmit={submit} className="mt-7 flex flex-col gap-5">
        <Input
          label="Full name"
          labelSo="Magaca"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <Input
          label="Phone"
          labelSo="Telefoon"
          type="tel"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          autoComplete="tel"
          hint="We ring every room booking to confirm it."
        />

        <div className="border border-line bg-surface-sunken px-3 py-2.5">
          <p className="translation">Email</p>
          <p className="mt-0.5 break-all text-sm text-ink-muted">{email}</p>
          <p className="mt-1.5 text-xs text-ink-subtle">
            Your email is your sign-in and can&apos;t be changed here.
          </p>
        </div>

        <Button type="submit" loading={saving} disabled={!dirty} className="self-start">
          {dirty ? "Save changes" : "Saved"}
        </Button>
      </form>
    </div>
  );
}
