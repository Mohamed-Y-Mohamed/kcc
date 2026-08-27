"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BedDouble, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AMENITY_OPTIONS,
  createRoom,
  deleteRoom,
  listRooms,
  updateRoom,
  type RoomInput,
} from "@/lib/rooms";
import { formatPrice } from "@/lib/format";
import type { Room } from "@/lib/types";
import { AdminHeader, SearchInput, TableWrap, Td, Th, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Textarea } from "@/components/ui/Field";
import { MultiImageField } from "@/components/ui/MultiImageField";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

const BLANK: RoomInput = {
  nameSo: "",
  nameEn: "",
  descriptionSo: "",
  descriptionEn: "",
  pricePerNight: 30,
  capacity: 2,
  beds: 1,
  location: "",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  amenities: [],
  images: [],
  quantity: 1,
  active: true,
};

export default function AdminRoomsPage() {
  return (
    <RequireCapability capability="manageRooms">
      <RoomsPage />
    </RequireCapability>
  );
}

function RoomsPage() {
  const { toast } = useToast();

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<Room | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<RoomInput>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleting, setDeleting] = useState<Room | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setRooms(await listRooms());
    } catch (err) {
      console.error(err);
      setError("Couldn't load rooms. Check Firestore rules are deployed.");
      setRooms([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(BLANK);
    setFormError("");
    setEditing(null);
    setCreating(true);
  }

  function openEdit(room: Room) {
    const { id, createdAt, updatedAt, ...rest } = room;
    void id;
    void createdAt;
    void updatedAt;
    setForm(rest);
    setFormError("");
    setCreating(false);
    setEditing(room);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function set<K extends keyof RoomInput>(key: K, value: RoomInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.nameSo.trim() || !form.nameEn.trim()) {
      setFormError("Both the Somali and English names are needed.");
      return;
    }
    if (form.pricePerNight <= 0) {
      setFormError("Set a nightly price above zero.");
      return;
    }
    if (form.quantity < 1) {
      setFormError("There has to be at least one of this room.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateRoom(editing.id, form);
        toast(`${form.nameEn} updated.`, "success");
      } else {
        await createRoom(form);
        toast(`${form.nameEn} added. It's live on the hotel page now.`, "success");
      }
      closeForm();
      await load();
    } catch (err) {
      console.error(err);
      setFormError("Couldn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(room: Room) {
    try {
      await updateRoom(room.id, { active: !room.active });
      toast(
        room.active
          ? `${room.nameEn} hidden from guests.`
          : `${room.nameEn} is visible again.`,
        "success"
      );
      await load();
    } catch {
      toast("Couldn't change that. Try again.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteRoom(deleting.id);
      toast(`${deleting.nameEn} deleted.`, "success");
      setDeleting(null);
      await load();
    } catch {
      toast("Couldn't delete that room.", "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  const filtered = (rooms ?? []).filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.nameEn.toLowerCase().includes(q) ||
      r.nameSo.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Rooms"
        titleSo="Qolalka"
        descriptionSo="Waxa halkan ku jira waxay ka muuqdaan bogga hoteelka."
        description="Hidden rooms keep their booking history but guests can't see or book them."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Ku dar qol · Add a room
          </Button>
        }
      />

      <Toolbar>
        <SearchInput
          label="Search rooms"
          value={search}
          onChange={setSearch}
          placeholder="Search by name or location…"
        />
        {rooms && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {filtered.length} of {rooms.length}
          </span>
        )}
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {rooms === null ? (
        <LoadingBlock label="Loading rooms" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title={rooms.length === 0 ? "No rooms yet" : "Nothing matches that"}
          description={
            rooms.length === 0
              ? "Add your first room type and it appears on the hotel page immediately, ready to book."
              : "Try a different name or clear the search."
          }
          action={
            rooms.length === 0 ? (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add a room
              </Button>
            ) : undefined
          }
        />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-20">Photo</Th>
              <Th>Room</Th>
              <Th>Location</Th>
              <Th>Price</Th>
              <Th>Sleeps</Th>
              <Th>Qty</Th>
              <Th>Check in / out</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((room) => (
              <tr key={room.id} className="hover:bg-surface-sunken">
                <Td>
                  <span className="relative block h-12 w-16 overflow-hidden rounded-[2px] border border-line bg-surface-sunken">
                    {room.images[0] ? (
                      <Image
                        src={room.images[0]}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="woven block h-full w-full" />
                    )}
                  </span>
                </Td>
                <Td>
                  <span className="block font-display text-base">
                    {room.nameSo}
                  </span>
                  <span className="translation">{room.nameEn}</span>
                </Td>
                <Td className="max-w-[12rem] text-sm text-ink-muted">
                  {room.location || "—"}
                </Td>
                <Td className="tnum whitespace-nowrap text-accent">
                  {formatPrice(room.pricePerNight)}
                </Td>
                <Td className="tnum">{room.capacity}</Td>
                <Td className="tnum">{room.quantity}</Td>
                <Td className="tnum whitespace-nowrap text-xs text-ink-muted">
                  {room.checkInTime} / {room.checkOutTime}
                </Td>
                <Td>
                  {room.active ? (
                    <Badge tone="success" icon={Eye}>
                      Live
                    </Badge>
                  ) : (
                    <Badge tone="neutral" icon={EyeOff}>
                      Hidden
                    </Badge>
                  )}
                </Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => toggleActive(room)}
                      aria-label={
                        room.active
                          ? `Hide ${room.nameEn} from guests`
                          : `Show ${room.nameEn} to guests`
                      }
                      className="p-2 text-ink-subtle transition-colors hover:text-ink"
                    >
                      {room.active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(room)}
                      aria-label={`Edit ${room.nameEn}`}
                      className="p-2 text-ink-subtle transition-colors hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(room)}
                      aria-label={`Delete ${room.nameEn}`}
                      className="p-2 text-ink-subtle transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {/* Add / edit */}
      <Modal
        open={creating || editing !== null}
        onClose={closeForm}
        size="lg"
        title={editing ? `Edit ${editing.nameEn}` : "Add a room"}
        description="Guests see all of this on the hotel page."
        footer={
          <>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" form="room-form" loading={saving}>
              {editing ? "Save changes" : "Add room"}
            </Button>
          </>
        }
      >
        <form id="room-form" onSubmit={save} className="flex flex-col gap-6">
          {formError && <ErrorNote message={formError} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Name (Somali)"
              value={form.nameSo}
              onChange={(e) => set("nameSo", e.target.value)}
              placeholder="Qol Laba Qof"
              required
            />
            <Input
              label="Name (English)"
              value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              placeholder="Double room"
              required
            />
          </div>

          <Textarea
            label="Description (Somali)"
            value={form.descriptionSo}
            onChange={(e) => set("descriptionSo", e.target.value)}
            rows={3}
          />
          <Textarea
            label="Description (English)"
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
            rows={3}
            hint="What makes this room worth booking. Two or three sentences."
          />

          <Input
            label="Location in the building"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Second floor, street side"
            hint="Shown to guests so they know what they're getting."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Price per night ($)"
              type="number"
              min={0}
              step="0.5"
              value={form.pricePerNight}
              onChange={(e) => set("pricePerNight", Number(e.target.value))}
              required
            />
            <Input
              label="Sleeps"
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => set("capacity", Number(e.target.value))}
              required
            />
            <Input
              label="Beds"
              type="number"
              min={1}
              value={form.beds}
              onChange={(e) => set("beds", Number(e.target.value))}
            />
            <Input
              label="How many rooms"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => set("quantity", Number(e.target.value))}
              hint="Sets how many can be booked at once."
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Check-in time"
              type="time"
              value={form.checkInTime}
              onChange={(e) => set("checkInTime", e.target.value)}
            />
            <Input
              label="Check-out time"
              type="time"
              value={form.checkOutTime}
              onChange={(e) => set("checkOutTime", e.target.value)}
            />
          </div>

          <MultiImageField
            label="Photos"
            values={form.images}
            onChange={(next) => set("images", next)}
            folder="rooms"
            hint="The first photo is the one guests see on the room card."
          />

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-ink">
              What&apos;s included
            </legend>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {AMENITY_OPTIONS.map((a) => (
                <Checkbox
                  key={a}
                  label={a}
                  checked={form.amenities.includes(a)}
                  onChange={(on) =>
                    set(
                      "amenities",
                      on
                        ? [...form.amenities, a]
                        : form.amenities.filter((x) => x !== a)
                    )
                  }
                />
              ))}
            </div>
          </fieldset>

          <div className="border-t border-line pt-5">
            <Checkbox
              label="Show this room to guests"
              hint="Turn off to take it off the site without deleting it."
              checked={form.active}
              onChange={(on) => set("active", on)}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title={`Delete ${deleting?.nameEn ?? "this room"}?`}
        body="This removes the room permanently. Existing bookings stay in the system but will no longer link to a room. If you only want it off the site, hide it instead."
      />
    </div>
  );
}
