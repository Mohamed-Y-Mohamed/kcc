"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  Clock,
  Inbox,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { deleteMessage, listMessages, setMessageStatus } from "@/lib/messages";
import { formatDate, formatTimestamp, todayISO } from "@/lib/format";
import type { ContactMessage, MessageStatus } from "@/lib/types";
import { AdminHeader, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { MessageStatusBadge } from "@/components/ui/Badge";
import { Bi } from "@/components/ui/Bi";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type When = "today" | "upcoming" | "previous" | "all";

const WHEN_TABS: { id: When; so: string; en: string }[] = [
  { id: "today", so: "Maanta", en: "Today" },
  { id: "upcoming", so: "Soo socda", en: "Upcoming" },
  { id: "previous", so: "Hore", en: "Previous" },
  { id: "all", so: "Dhammaan", en: "All" },
];

const STATUS_TABS: { id: MessageStatus | ""; so: string; en: string }[] = [
  { id: "", so: "Dhammaan", en: "All" },
  { id: "new", so: "Cusub", en: "New" },
  { id: "read", so: "La akhriyay", en: "Read" },
  { id: "archived", so: "La kaydiyay", en: "Archived" },
];

export default function AdminMessagesPage() {
  return (
    <RequireCapability capability="manageMessages">
      <MessagesPage />
    </RequireCapability>
  );
}

function MessagesPage() {
  const { toast } = useToast();

  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [when, setWhen] = useState<When>("today");
  const [status, setStatus] = useState<MessageStatus | "">("");
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setMessages(await listMessages());
    } catch (err) {
      console.error(err);
      setError("Couldn't load messages. Check Firestore rules are deployed.");
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function mark(message: ContactMessage, next: MessageStatus) {
    try {
      await setMessageStatus(message.id, next);
      await load();
    } catch {
      toast("Couldn't update that message.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteMessage(deleting.id);
      toast("Message deleted.", "success");
      setDeleting(null);
      await load();
    } catch {
      toast("Couldn't delete that message.", "error");
    } finally {
      setBusy(false);
    }
  }

  const today = todayISO();

  const counts = useMemo(() => {
    const all = messages ?? [];
    return {
      today: all.filter((m) => m.date === today).length,
      upcoming: all.filter((m) => m.date && m.date > today).length,
      previous: all.filter((m) => !m.date || m.date < today).length,
      all: all.length,
      unread: all.filter((m) => m.status === "new").length,
    };
  }, [messages, today]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (messages ?? [])
      .filter((m) => {
        if (status && m.status !== status) return false;

        if (when === "today" && m.date !== today) return false;
        if (when === "upcoming" && !(m.date && m.date > today)) return false;
        if (when === "previous" && !(!m.date || m.date < today)) return false;

        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Soonest first when looking forward, most recent first when looking back.
        if (when === "previous") return (b.date || "").localeCompare(a.date || "");
        return (a.date || "9999").localeCompare(b.date || "9999");
      });
  }, [messages, search, status, when, today]);

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Table bookings & messages"
        titleSo="Miisas & Fariimo"
        descriptionSo={
          counts.unread
            ? `${counts.unread} fariin oo aan la akhrin · ${counts.today} miis oo maanta ah.`
            : `${counts.today} miis oo maanta ah.`
        }
        description="Everything sent from the contact form — table reservations and general enquiries."
      />

      {/* When */}
      <div
        role="tablist"
        aria-label="Filter by date"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-line"
      >
        {WHEN_TABS.map((tab) => {
          const active = when === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => setWhen(tab.id)}
              className={cn(
                "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 transition-colors",
                active
                  ? "border-accent-solid text-ink"
                  : "border-transparent text-ink-subtle hover:text-ink"
              )}
            >
              <Bi so={tab.so} en={tab.en} size="sm" />
              <span className="tnum rounded-[2px] bg-surface-sunken px-1.5 text-[0.65rem] text-ink-muted">
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      <Toolbar>
        <div className="relative w-full sm:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            aria-label="Search by name, email, phone or message"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Raadi magac, iimayl ama qoraal · Search…"
            className="h-10 w-full rounded-[2px] border border-line bg-surface-raised pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle"
          />
        </div>

        <div className="flex gap-1 rounded-[2px] border border-line p-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id || "all"}
              onClick={() => setStatus(tab.id)}
              aria-pressed={status === tab.id}
              className={cn(
                "rounded-[2px] px-3 py-1.5 text-left transition-colors",
                status === tab.id
                  ? "bg-accent-solid text-accent-ink"
                  : "text-ink-subtle hover:text-ink"
              )}
            >
              <Bi so={tab.so} en={tab.en} size="sm" />
            </button>
          ))}
        </div>

        {messages && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {filtered.length} / {messages.length}
          </span>
        )}
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {messages === null ? (
        <LoadingBlock label="Loading messages" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={
            messages.length === 0
              ? "Wax fariin ah ma jiraan · Inbox empty"
              : "Waxba kuma jiraan · Nothing here"
          }
          description={
            messages.length === 0
              ? "Table bookings and enquiries from the contact page arrive here."
              : "Try another date range, or clear the search."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((m) => (
            <li
              key={m.id}
              className={cn(
                "border bg-surface-raised p-5",
                m.status === "new" ? "border-accent-solid/50" : "border-line"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-xl text-ink">{m.name}</h2>
                  {m.occasion && (
                    <p className="mt-0.5 text-sm text-ink-muted">{m.occasion}</p>
                  )}
                </div>
                <MessageStatusBadge status={m.status} />
              </div>

              {/* The reservation itself */}
              <dl className="mt-4 grid grid-cols-2 gap-4 border-y border-line py-4 text-sm sm:grid-cols-4">
                <div>
                  <dt className="translation flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" /> Taariikh · Date
                  </dt>
                  <dd className="mt-1 text-ink">
                    {m.date ? formatDate(m.date) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="translation flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Saacad · Time
                  </dt>
                  <dd className="tnum mt-1 text-ink">{m.time || "—"}</dd>
                </div>
                <div>
                  <dt className="translation flex items-center gap-1.5">
                    <UsersIcon className="h-3 w-3" /> Dad · People
                  </dt>
                  <dd className="tnum mt-1 text-ink">{m.partySize || "—"}</dd>
                </div>
                <div>
                  <dt className="translation">La diray · Sent</dt>
                  <dd className="mt-1 text-xs text-ink-muted">
                    {formatTimestamp(m.createdAt)}
                  </dd>
                </div>
              </dl>

              {m.message && (
                <p className="mt-4 whitespace-pre-line border-l-2 border-line pl-4 text-sm leading-relaxed text-ink-muted">
                  {m.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex h-9 items-center gap-2 rounded-[2px] border border-line px-3 text-xs text-ink transition-colors hover:border-accent-solid hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {m.email}
                </a>
                {m.phone && (
                  <a
                    href={`tel:${m.phone}`}
                    className="inline-flex h-9 items-center gap-2 rounded-[2px] border border-line px-3 text-xs text-ink transition-colors hover:border-accent-solid hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span className="tnum">{m.phone}</span>
                  </a>
                )}

                <div className="ml-auto flex flex-wrap gap-2">
                  {m.status === "new" && (
                    <Button size="sm" variant="secondary" onClick={() => mark(m, "read")}>
                      <MailOpen className="h-3.5 w-3.5" />
                      La akhriyay · Mark read
                    </Button>
                  )}
                  {m.status !== "archived" && (
                    <Button size="sm" variant="ghost" onClick={() => mark(m, "archived")}>
                      <Archive className="h-3.5 w-3.5" />
                      Kaydi · Archive
                    </Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => setDeleting(m)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Tirtir · Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={busy}
        confirmLabel="Tirtir · Delete"
        title="Tirtir fariintan? · Delete this message?"
        body={`The enquiry from ${deleting?.name ?? "this person"} will be removed permanently. Archive it instead if you might need it later.`}
      />
    </div>
  );
}
