"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Archive, Inbox, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import {
  deleteMessage,
  listMessages,
  setMessageStatus,
} from "@/lib/messages";
import { formatDate, formatTimestamp } from "@/lib/format";
import type { ContactMessage, MessageStatus } from "@/lib/types";
import { AdminHeader, SearchInput, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { MessageStatusBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

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
  const [filter, setFilter] = useState<MessageStatus | "">("");
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

  async function mark(message: ContactMessage, status: MessageStatus) {
    try {
      await setMessageStatus(message.id, status);
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

  const filtered = (messages ?? []).filter((m) => {
    if (filter && m.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const unread = (messages ?? []).filter((m) => m.status === "new").length;

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Messages"
        titleSo="Fariimaha"
        descriptionSo={
          unread
            ? `${unread} fariin oo aan la akhrin.`
            : "Wax fariin cusub ah ma jiraan."
        }
        description={
          unread
            ? `${unread} unread ${unread === 1 ? "enquiry" : "enquiries"} from the contact form.`
            : "Table bookings and enquiries from the contact form."
        }
      />

      <Toolbar>
        <SearchInput
          label="Search messages"
          value={search}
          onChange={setSearch}
          placeholder="Search name, email or text…"
        />
        <div className="flex gap-1 rounded-[2px] border border-line p-0.5">
          {([
            ["", "All"],
            ["new", "New"],
            ["read", "Read"],
            ["archived", "Archived"],
          ] as const).map(([value, label]) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-[2px] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors",
                filter === value
                  ? "bg-accent-solid text-accent-ink"
                  : "text-ink-subtle hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {messages === null ? (
        <LoadingBlock label="Loading messages" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={messages.length === 0 ? "Inbox empty" : "Nothing in this view"}
          description={
            messages.length === 0
              ? "Enquiries sent from the contact page arrive here."
              : "Try clearing the filter."
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
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-subtle">
                    <span>{formatTimestamp(m.createdAt)}</span>
                    {m.occasion && <span>· {m.occasion}</span>}
                    {m.partySize > 0 && <span>· {m.partySize} people</span>}
                    {m.date && (
                      <span>
                        · {formatDate(m.date)} {m.time}
                      </span>
                    )}
                  </p>
                </div>
                <MessageStatusBadge status={m.status} />
              </div>

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

                <div className="ml-auto flex gap-2">
                  {m.status === "new" && (
                    <Button size="sm" variant="secondary" onClick={() => mark(m, "read")}>
                      <MailOpen className="h-3.5 w-3.5" />
                      Mark read
                    </Button>
                  )}
                  {m.status !== "archived" && (
                    <Button size="sm" variant="ghost" onClick={() => mark(m, "archived")}>
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => setDeleting(m)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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
        title="Delete this message?"
        body={`The enquiry from ${deleting?.name ?? "this person"} will be removed permanently. Archive it instead if you might need it later.`}
      />
    </div>
  );
}
