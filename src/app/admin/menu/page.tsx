"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import {
  CATEGORY_LABELS,
  SECTION_LABELS,
  categoryLabel,
  createMenuItem,
  deleteMenuItem,
  distinctCategories,
  distinctSections,
  itemNames,
  listMenuItems,
  sectionLabel,
  updateMenuItem,
  type MenuItemInput,
} from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { AdminHeader, TableWrap, Td, Th, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageField } from "@/components/ui/ImageField";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

const BLANK: MenuItemInput = {
  nameEn: "",
  nameSo: "",
  descriptionEn: "",
  descriptionSo: "",
  price: 0,
  section: "lunch",
  category: "lunch-food",
  type: "Normal",
  image: "",
  imageSource: "none",
  isActive: true,
  popular: false,
  signature: false,
};

export default function AdminMenuPage() {
  return (
    <RequireCapability capability="manageMenu">
      <MenuPage />
    </RequireCapability>
  );
}

function MenuPage() {
  const { toast } = useToast();

  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<MenuItemInput>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setItems(await listMenuItems());
    } catch (err) {
      console.error(err);
      setError("Couldn't load the menu. Check Firestore rules are deployed.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sections = useMemo(() => distinctSections(items ?? []), [items]);
  const categories = useMemo(() => distinctCategories(items ?? []), [items]);

  function openCreate() {
    setForm({ ...BLANK, section: sectionFilter || "lunch" });
    setFormError("");
    setEditing(null);
    setCreating(true);
  }

  function openEdit(item: MenuItem) {
    const { id, createdAt, updatedAt, ...rest } = item;
    void id;
    void createdAt;
    void updatedAt;
    setForm(rest);
    setFormError("");
    setCreating(false);
    setEditing(item);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function set<K extends keyof MenuItemInput>(key: K, value: MenuItemInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.nameEn.trim() && !form.nameSo.trim()) {
      setFormError("Give it a name in at least one language.");
      return;
    }
    if (!form.section) {
      setFormError("Pick which part of the day this belongs to.");
      return;
    }
    if (form.price < 0) {
      setFormError("Price can't be negative.");
      return;
    }

    setSaving(true);
    try {
      const label = form.nameEn || form.nameSo;
      if (editing) {
        await updateMenuItem(editing.id, form);
        toast(`${label} updated.`, "success");
      } else {
        await createMenuItem(form);
        toast(`${label} added to the menu.`, "success");
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

  async function toggleActive(item: MenuItem) {
    const label = itemNames(item).lead;
    try {
      await updateMenuItem(item.id, { isActive: !item.isActive });
      toast(
        item.isActive ? `${label} marked sold out.` : `${label} is back on.`,
        "success"
      );
      await load();
    } catch {
      toast("Couldn't change that.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteMenuItem(deleting.id);
      toast(`${itemNames(deleting).lead} deleted.`, "success");
      setDeleting(null);
      await load();
    } catch {
      toast("Couldn't delete that.", "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  const filtered = (items ?? []).filter((i) => {
    if (sectionFilter && i.section !== sectionFilter) return false;
    if (categoryFilter && i.category !== categoryFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      i.nameEn.toLowerCase().includes(q) || i.nameSo.toLowerCase().includes(q)
    );
  });

  const missingSomali = (items ?? []).filter(
    (i) => i.nameEn && !i.nameSo.trim()
  ).length;

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Food & drink"
        titleSo="Cunto & Cabitaan"
        descriptionSo="Kanu waa menu-ga ay macmiilku akhriyaan."
        description="Sold-out items stay listed but greyed out for guests."
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Ku dar cunto · Add food
          </Button>
        }
      />

      {/* The import brought English names only. Worth knowing, not an error. */}
      {missingSomali > 0 && (
        <div className="mt-5 border-l-2 border-accent-solid bg-accent-solid/5 px-4 py-3">
          <p className="text-sm text-ink">
            <span className="font-medium">{missingSomali}</span> items have no
            Somali name yet — guests see the English one instead.
          </p>
          <p className="translation mt-1">
            Add Somali names as you go and the menu becomes fully bilingual
          </p>
        </div>
      )}

      <Toolbar>
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            aria-label="Search the menu"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Raadi cunto · Search dishes…"
            className="h-10 w-full rounded-[2px] border border-line bg-surface-raised pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle"
          />
        </div>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          aria-label="Filter by section"
          className="h-10 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink"
        >
          <option value="">Qaybaha oo dhan · All sections</option>
          {sections.map((key) => (
            <option key={key} value={key}>
              {sectionLabel(key).so} · {sectionLabel(key).en}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="h-10 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink"
        >
          <option value="">Noocyada oo dhan · All categories</option>
          {categories.map((key) => (
            <option key={key} value={key}>
              {categoryLabel(key).en}
            </option>
          ))}
        </select>

        {items && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-subtle">
            {filtered.length} of {items.length}
          </span>
        )}
      </Toolbar>

      {error && <ErrorNote message={error} />}

      {items === null ? (
        <LoadingBlock label="Loading the menu" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={items.length === 0 ? "Nothing on the menu yet" : "Nothing matches"}
          description={
            items.length === 0
              ? "Add your first dish and it appears on the menu page straight away."
              : "Try a different search, or clear the filters."
          }
          action={
            items.length === 0 ? (
              <Button onClick={openCreate}>Add food</Button>
            ) : undefined
          }
        />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th so="Sawir" className="w-16">Photo</Th>
              <Th so="Cunto">Dish</Th>
              <Th so="Qaybta">Section</Th>
              <Th so="Nooca">Category</Th>
              <Th so="Qiimo">Price</Th>
              <Th so="Calaamado">Tags</Th>
              <Th so="Xaalad">Status</Th>
              <Th so="Ficil" className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const name = itemNames(item);
              return (
                <tr key={item.id} className="hover:bg-surface-sunken">
                  <Td>
                    <span className="relative block h-11 w-11 overflow-hidden rounded-[2px] border border-line bg-surface-sunken">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="44px"
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
                      {name.lead}
                    </span>
                    {name.sub ? (
                      <span className="translation">{name.sub}</span>
                    ) : (
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-subtle">
                        No Somali name
                      </span>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-sm text-ink-muted">
                    {sectionLabel(item.section).en}
                  </Td>
                  <Td className="whitespace-nowrap text-sm text-ink-muted">
                    {categoryLabel(item.category).en}
                  </Td>
                  <Td className="tnum whitespace-nowrap text-accent">
                    {formatPrice(item.price)}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {item.signature && <Badge tone="accent">Signature</Badge>}
                      {item.popular && <Badge tone="neutral">Popular</Badge>}
                    </div>
                  </Td>
                  <Td>
                    {item.isActive ? (
                      <Badge tone="success" icon={Eye}>
                        On
                      </Badge>
                    ) : (
                      <Badge tone="danger" icon={EyeOff}>
                        Sold out
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => toggleActive(item)}
                        aria-label={
                          item.isActive
                            ? `Mark ${name.lead} sold out`
                            : `Put ${name.lead} back on`
                        }
                        className="p-2 text-ink-subtle transition-colors hover:text-ink"
                      >
                        {item.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${name.lead}`}
                        className="p-2 text-ink-subtle transition-colors hover:text-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(item)}
                        aria-label={`Delete ${name.lead}`}
                        className="p-2 text-ink-subtle transition-colors hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      )}

      <Modal
        open={creating || editing !== null}
        onClose={closeForm}
        size="md"
        title={
          editing ? `Edit ${itemNames(editing).lead}` : "Add food or drink"
        }
        titleSo={editing ? "Wax ka beddel" : "Ku dar cunto"}
        footer={
          <>
            <Button variant="ghost" onClick={closeForm}>
              Ka noqo · Cancel
            </Button>
            <Button type="submit" form="menu-form" loading={saving}>
              {editing ? "Kaydi · Save changes" : "Ku dar · Add to menu"}
            </Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={save} className="flex flex-col gap-6">
          {formError && <ErrorNote message={formError} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Name (English)"
              labelSo="Magaca (Ingiriisi)"
              value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              placeholder="Spiced rice"
            />
            <Input
              label="Name (Somali)"
              labelSo="Magaca (Soomaali)"
              value={form.nameSo}
              onChange={(e) => set("nameSo", e.target.value)}
              placeholder="Bariis Iskukaris"
              hint="Shown first on the menu when it's filled in."
            />
          </div>

          <Textarea
            label="Description (English)"
            labelSo="Faahfaahin (Ingiriisi)"
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
            rows={2}
          />
          <Textarea
            label="Description (Somali)"
            labelSo="Faahfaahin (Soomaali)"
            value={form.descriptionSo}
            onChange={(e) => set("descriptionSo", e.target.value)}
            rows={2}
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <Select
              label="Section"
              labelSo="Qaybta"
              value={form.section}
              onChange={(e) => set("section", e.target.value)}
              options={Object.keys(SECTION_LABELS).map((key) => ({
                value: key,
                label: `${SECTION_LABELS[key].so} · ${SECTION_LABELS[key].en}`,
              }))}
              hint="Which part of the day."
              required
            />
            <Select
              label="Category"
              labelSo="Nooca"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              options={Object.keys(CATEGORY_LABELS).map((key) => ({
                value: key,
                label: CATEGORY_LABELS[key].en,
              }))}
            />
            <Input
              label="Price ($)"
              labelSo="Qiimaha ($)"
              type="number"
              min={0}
              step="0.25"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              required
            />
          </div>

          <ImageField
            label="Photo — optional · Sawir (ikhtiyaari)"
            value={form.image}
            onChange={(url) => set("image", url)}
            folder="menu"
            hint="Leave it empty and the menu just shows the name and price, which is how it reads now. Add photos whenever you have them."
          />

          <fieldset className="flex flex-col gap-3 border-t border-line pt-5">
            <legend className="sr-only">Options</legend>
            <Checkbox
              label="Available · La heli karo"
              hint="Turn off to show it as sold out."
              checked={form.isActive}
              onChange={(on) => set("isActive", on)}
            />
            <Checkbox
              label="Signature dish · Cunto gaar ah"
              hint="Highlighted, and shown on the home page board."
              checked={form.signature}
              onChange={(on) => set("signature", on)}
            />
            <Checkbox
              label="Popular · Caan ah"
              checked={form.popular}
              onChange={(on) => set("popular", on)}
            />
          </fieldset>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title={`Delete ${deleting ? itemNames(deleting).lead : "this dish"}?`}
        body="This removes it from the menu permanently. To take it off temporarily, mark it sold out instead."
      />
    </div>
  );
}
