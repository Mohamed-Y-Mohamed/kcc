"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Search, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { filterUsers, listUsers, setUserRole, updateOwnProfile } from "@/lib/users";
import {
  ROLE_META,
  ROLES,
  assignableRoles,
  isOwnerEmail,
} from "@/lib/roles";
import { formatTimestamp } from "@/lib/format";
import type { AppUser, Role } from "@/lib/types";
import { AdminHeader, TableWrap, Td, Th, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { RoleBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export default function AdminUsersPage() {
  return (
    <RequireCapability capability="manageUsers">
      <UsersPage />
    </RequireCapability>
  );
}

function UsersPage() {
  const { user: currentUser, role: myRole, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [draft, setDraft] = useState({ displayName: "", phone: "", role: "user" as Role });
  const [saving, setSaving] = useState(false);

  const canAssign = assignableRoles(myRole);

  const load = useCallback(async () => {
    setError("");
    try {
      setUsers(await listUsers());
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't load users. Only owners, admins and managers can read the user list — check firestore.rules is deployed."
      );
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openEdit(u: AppUser) {
    setDraft({ displayName: u.displayName, phone: u.phone, role: u.role });
    setEditing(u);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (
        draft.displayName !== editing.displayName ||
        draft.phone !== editing.phone
      ) {
        await updateOwnProfile(editing.uid, {
          displayName: draft.displayName.trim(),
          phone: draft.phone.trim(),
        });
      }
      if (draft.role !== editing.role) {
        await setUserRole(editing.uid, draft.role);
        toast(
          `${editing.displayName || editing.email} is now ${ROLE_META[draft.role].label}.`,
          "success"
        );
      } else {
        toast("Details saved.", "success");
      }
      setEditing(null);
      await load();
      if (editing.uid === currentUser?.uid) await refreshProfile();
    } catch (err) {
      console.error(err);
      toast(
        "Couldn't save that. Your role may not allow this change.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  const filtered = filterUsers(users ?? [], search).filter(
    (u) => !roleFilter || u.role === roleFilter
  );

  const counts = ROLES.reduce<Record<string, number>>((acc, r) => {
    acc[r] = (users ?? []).filter((u) => u.role === r).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Users"
        description="Look someone up by email, change their details, and set what they're allowed to do."
      />

      {/* What each role means — so nobody has to guess before promoting someone */}
      <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(roleFilter === r ? "" : r)}
            className={cn(
              "flex flex-col gap-1.5 p-4 text-left transition-colors",
              roleFilter === r
                ? "bg-surface-sunken"
                : "bg-surface hover:bg-surface-sunken"
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <RoleBadge role={r} />
              <span className="tnum text-sm text-ink-muted">
                {counts[r] ?? 0}
              </span>
            </span>
            <span className="text-xs leading-relaxed text-ink-subtle">
              {ROLE_META[r].summary}
            </span>
          </button>
        ))}
      </div>

      <Toolbar>
        <div className="relative w-full sm:w-96">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            aria-label="Search users by email, name or phone"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email address…"
            className="h-11 w-full rounded-[2px] border border-line bg-surface-raised pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle"
          />
        </div>
        {roleFilter && (
          <Button variant="ghost" size="sm" onClick={() => setRoleFilter("")}>
            Clear {ROLE_META[roleFilter].label} filter
          </Button>
        )}
        {users && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {filtered.length} of {users.length}
          </span>
        )}
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {canAssign.length === 0 && (
        <ErrorNote message="Your role can view users but not change anyone's role." />
      )}

      {users === null ? (
        <LoadingBlock label="Loading users" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={users.length === 0 ? "No accounts yet" : "Nobody matches that"}
          description={
            users.length === 0
              ? "Accounts appear here as soon as someone signs up on the site."
              : "Try part of an email address instead — search matches email, name and phone."
          }
        />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Joined</Th>
              <Th>Role</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isSelf = u.uid === currentUser?.uid;
              const isOwner = u.role === "owner" || isOwnerEmail(u.email);
              // The owner is pinned to an email address and can't be edited by
              // anyone, including themselves.
              const editable = canAssign.length > 0 && !isOwner && !isSelf;

              return (
                <tr key={u.uid} className="hover:bg-surface-sunken">
                  <Td>
                    <span className="block font-medium">
                      {u.displayName || "—"}
                    </span>
                    {isSelf && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
                        That&apos;s you
                      </span>
                    )}
                  </Td>
                  <Td className="break-all text-sm text-ink-muted">{u.email}</Td>
                  <Td className="tnum whitespace-nowrap text-sm text-ink-muted">
                    {u.phone || "—"}
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-ink-subtle">
                    {formatTimestamp(u.createdAt)}
                  </Td>
                  <Td>
                    <RoleBadge role={u.role} />
                  </Td>
                  <Td>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!editable}
                        title={
                          isOwner
                            ? "The owner account can't be changed"
                            : isSelf
                            ? "You can't change your own role"
                            : undefined
                        }
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="sm"
        title={editing?.email ?? "Edit user"}
        description="Change their details or what they're allowed to do."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" form="user-form" loading={saving}>
              Save changes
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={save} className="flex flex-col gap-5">
          <Input
            label="Full name"
            value={draft.displayName}
            onChange={(e) =>
              setDraft((d) => ({ ...d, displayName: e.target.value }))
            }
          />
          <Input
            label="Phone"
            type="tel"
            value={draft.phone}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
          />

          <Select
            label="Role"
            value={draft.role}
            onChange={(e) =>
              setDraft((d) => ({ ...d, role: e.target.value as Role }))
            }
            options={
              // Always include their current role so the select isn't lying
              // about where they are now, even if you can't grant it yourself.
              Array.from(new Set([editing?.role, ...canAssign].filter(Boolean)))
                .map((r) => ({
                  value: r as string,
                  label: ROLE_META[r as Role].label,
                }))
            }
            hint={ROLE_META[draft.role]?.summary}
          />

          {draft.role !== editing?.role && (
            <p className="flex items-start gap-2 border-l-2 border-accent-solid bg-accent-solid/5 px-3 py-2.5 text-xs leading-relaxed text-ink-muted">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              They&apos;ll get this the next time their session refreshes.
            </p>
          )}

          {canAssign.length === 0 && (
            <ErrorNote message="Your role can't change other people's roles." />
          )}
        </form>
      </Modal>
    </div>
  );
}
