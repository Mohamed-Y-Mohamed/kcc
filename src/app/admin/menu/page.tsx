"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  listCategories,
  listMenuItems,
  updateMenuItem,
  type MenuItemInput,
} from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { AdminHeader, SearchInput, TableWrap, Td, Th, Toolbar } from "@/components/admin/Shell";
import { RequireCapability } from "@/components/admin/RequireCapability";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageField } from "@/components/ui/ImageField";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorNote, LoadingBlock } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

const BLANK: MenuItemInput = {
  nameSo: "",
  nameEn: "",
  descriptionSo: "",
  descriptionEn: "",
  price: 0,
  categoryId: "",
  imageUrl: "",
  available: true,
  popular: false,
  signature: false,
  order: 0,
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
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<MenuItemInput>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [catOpen, setCatOpen] = useState(false);
  const [catForm, setCatForm] = useState({ nameSo: "", nameEn: "" });
  const [catSaving, setCatSaving] = useState(false);

  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [deletingCat, setDeletingCat] = useState<MenuCategory | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const [nextItems, nextCats] = await Promise.all([
        listMenuItems(),
        listCategories(),
      ]);
      setItems(nextItems);
      setCategories(nextCats);
    } catch (err) {
      console.error(err);
      setError("Couldn't load the menu. Check Firestore rules are deployed.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm({
      ...BLANK,
      categoryId: categories[0]?.id ?? "",
      order: (items?.length ?? 0) + 1,
    });
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

    if (!form.nameSo.trim() || !form.nameEn.trim()) {
      setFormError("Both the Somali and English names are needed.");
      return;
    }
    if (!form.categoryId) {
      setFormError("Pick a category. Add one first if the list is empty.");
      return;
    }
    if (form.price <= 0) {
      setFormError("Set a price above zero.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateMenuItem(editing.id, form);
        toast(`${form.nameEn} updated.`, "success");
      } else {
        await createMenuItem(form);
        toast(`${form.nameEn} added to the menu.`, "success");
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

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catForm.nameSo.trim() || !catForm.nameEn.trim()) return;
    setCatSaving(true);
    try {
      await createCategory({
        nameSo: catForm.nameSo.trim(),
        nameEn: catForm.nameEn.trim(),
        order: categories.length + 1,
      });
      toast(`Category "${catForm.nameEn}" added.`, "success");
      setCatForm({ nameSo: "", nameEn: "" });
      setCatOpen(false);
      await load();
    } catch {
      toast("Couldn't add that category.", "error");
    } finally {
      setCatSaving(false);
    }
  }

  async function toggleAvailable(item: MenuItem) {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      toast(
        item.available
          ? `${item.nameEn} marked sold out.`
          : `${item.nameEn} is back on.`,
        "success"
      );
      await load();
    } catch {
      toast("Couldn't change that.", "error");
    }
  }

  async function confirmDelete() {
    setDeletingBusy(true);
    try {
      if (deleting) {
        await deleteMenuItem(deleting.id);
        toast(`${deleting.nameEn} deleted.`, "success");
        setDeleting(null);
      } else if (deletingCat) {
        await deleteCategory(deletingCat.id);
        toast(`Category "${deletingCat.nameEn}" deleted.`, "success");
        setDeletingCat(null);
      }
      await load();
    } catch {
      toast("Couldn't delete that.", "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.nameEn ?? "Uncategorised";

  const filtered = (items ?? []).filter((i) => {
    if (categoryFilter && i.categoryId !== categoryFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      i.nameEn.toLowerCase().includes(q) || i.nameSo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <AdminHeader
        title="Food & drink"
        description="This is the menu customers read. Sold-out items stay listed but greyed out."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCatOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              Add category
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add food
            </Button>
          </>
        }
      />

      <Toolbar>
        <SearchInput
          label="Search the menu"
          value={search}
          onChange={setSearch}
          placeholder="Search dishes…"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="h-10 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameEn}
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

      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-subtle">
            Categories
          </span>
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2 py-1 text-xs text-ink-muted"
            >
              {c.nameEn}
              <button
                onClick={() => setDeletingCat(c)}
                aria-label={`Delete category ${c.nameEn}`}
                className="text-ink-subtle hover:text-danger"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {items === null ? (
        <LoadingBlock label="Loading the menu" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={items.length === 0 ? "Nothing on the menu yet" : "Nothing matches"}
          description={
            items.length === 0
              ? "Add a category first, then start adding dishes. They appear on the menu page straight away."
              : "Try a different search or clear the category filter."
          }
          action={
            items.length === 0 ? (
              <Button onClick={categories.length ? openCreate : () => setCatOpen(true)}>
                {categories.length ? "Add food" : "Add a category"}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-16">Photo</Th>
              <Th>Dish</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Tags</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-surface-sunken">
                <Td>
                  <span className="relative block h-11 w-11 overflow-hidden rounded-[2px] border border-line bg-surface-sunken">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
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
                    {item.nameSo}
                  </span>
                  <span className="translation">{item.nameEn}</span>
                </Td>
                <Td className="text-sm text-ink-muted">
                  {categoryName(item.categoryId)}
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
                  {item.available ? (
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
                      onClick={() => toggleAvailable(item)}
                      aria-label={
                        item.available
                          ? `Mark ${item.nameEn} sold out`
                          : `Put ${item.nameEn} back on`
                      }
                      className="p-2 text-ink-subtle transition-colors hover:text-ink"
                    >
                      {item.available ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.nameEn}`}
                      className="p-2 text-ink-subtle transition-colors hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(item)}
                      aria-label={`Delete ${item.nameEn}`}
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

      {/* Add / edit dish */}
      <Modal
        open={creating || editing !== null}
        onClose={closeForm}
        size="md"
        title={editing ? `Edit ${editing.nameEn}` : "Add food or drink"}
        footer={
          <>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" form="menu-form" loading={saving}>
              {editing ? "Save changes" : "Add to menu"}
            </Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={save} className="flex flex-col gap-6">
          {formError && <ErrorNote message={formError} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Name (Somali)"
              value={form.nameSo}
              onChange={(e) => set("nameSo", e.target.value)}
              placeholder="Bariis Iskukaris"
              required
            />
            <Input
              label="Name (English)"
              value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              placeholder="Spiced rice"
              required
            />
          </div>

          <Textarea
            label="Description (Somali)"
            value={form.descriptionSo}
            onChange={(e) => set("descriptionSo", e.target.value)}
            rows={2}
          />
          <Textarea
            label="Description (English)"
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
            rows={2}
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.nameEn }))}
              placeholder={categories.length ? "Choose…" : "Add a category first"}
              required
            />
            <Input
              label="Price ($)"
              type="number"
              min={0}
              step="0.25"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              required
            />
            <Input
              label="Sort order"
              type="number"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
              hint="Lower shows first."
            />
          </div>

          <ImageField
            label="Photo"
            value={form.imageUrl}
            onChange={(url) => set("imageUrl", url)}
            folder="menu"
            hint="Optional. A woven pattern is used when there's no photo."
          />

          <fieldset className="flex flex-col gap-3 border-t border-line pt-5">
            <legend className="sr-only">Options</legend>
            <Checkbox
              label="Available"
              hint="Turn off to show it as sold out."
              checked={form.available}
              onChange={(on) => set("available", on)}
            />
            <Checkbox
              label="Signature dish"
              hint="Highlighted, and shown on the home page board."
              checked={form.signature}
              onChange={(on) => set("signature", on)}
            />
            <Checkbox
              label="Popular"
              checked={form.popular}
              onChange={(on) => set("popular", on)}
            />
          </fieldset>
        </form>
      </Modal>

      {/* Add category */}
      <Modal
        open={catOpen}
        onClose={() => setCatOpen(false)}
        size="sm"
        title="Add a category"
        description="Categories are the headings on the menu page."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCatOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="cat-form" loading={catSaving}>
              Add category
            </Button>
          </>
        }
      >
        <form id="cat-form" onSubmit={saveCategory} className="flex flex-col gap-5">
          <Input
            label="Name (Somali)"
            value={catForm.nameSo}
            onChange={(e) => setCatForm((f) => ({ ...f, nameSo: e.target.value }))}
            placeholder="Cuntada Weyn"
            required
          />
          <Input
            label="Name (English)"
            value={catForm.nameEn}
            onChange={(e) => setCatForm((f) => ({ ...f, nameEn: e.target.value }))}
            placeholder="Main dishes"
            required
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null || deletingCat !== null}
        onClose={() => {
          setDeleting(null);
          setDeletingCat(null);
        }}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title={
          deleting
            ? `Delete ${deleting.nameEn}?`
            : `Delete category ${deletingCat?.nameEn}?`
        }
        body={
          deleting
            ? "This removes the dish from the menu permanently. To take it off temporarily, mark it sold out instead."
            : "Dishes in this category stay in the system but won't show on the menu until you move them to another category."
        }
      />
    </div>
  );
}
