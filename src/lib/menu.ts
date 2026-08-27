import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { MenuItem } from "./types";

/**
 * The menu lives in `foodItems`, which was populated by an earlier import. This
 * module is the only place that knows its field shape — everything above it
 * works with the tidy `MenuItem` type.
 */
const ITEMS = "foodItems";

/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                    */
/*                                                                             */
/* Sections and categories are plain strings on each record rather than their   */
/* own collections. Deriving the lists from the data keeps them honest — a      */
/* section only exists while something is filed under it.                      */
/* -------------------------------------------------------------------------- */

export const SECTION_LABELS: Record<string, { so: string; en: string }> = {
  breakfast: { so: "Quraac", en: "Breakfast" },
  lunch: { so: "Qado", en: "Lunch" },
  dinner: { so: "Casho", en: "Dinner" },
  sides: { so: "Raashin Dheeraad", en: "Sides" },
  drinks: { so: "Cabitaan", en: "Drinks" },
};

/** Menu reading order — meals through the day, then extras. */
const SECTION_ORDER = ["breakfast", "lunch", "dinner", "sides", "drinks"];

export const CATEGORY_LABELS: Record<string, { so: string; en: string }> = {
  "breakfast-food": { so: "Cunto Quraac", en: "Breakfast food" },
  "lunch-food": { so: "Cunto Qado", en: "Lunch food" },
  "dinner-food": { so: "Cunto Casho", en: "Dinner food" },
  "fast-food": { so: "Cunto Degdeg", en: "Fast food" },
  wadani: { so: "Wadani", en: "Traditional Somali" },
  "hot-tea": { so: "Shaah Kulul", en: "Hot tea & coffee" },
  "cold-tea": { so: "Shaah Qabow", en: "Cold tea" },
  juice: { so: "Casiir", en: "Juice" },
  fruits: { so: "Miro", en: "Fruit" },
};

export function sectionLabel(key: string) {
  return SECTION_LABELS[key] ?? { so: key, en: key };
}

export function categoryLabel(key: string) {
  return (
    CATEGORY_LABELS[key] ?? {
      so: key,
      // Turn an unknown slug into something readable rather than showing
      // "lunch-food" raw.
      en: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }
  );
}

/* -------------------------------------------------------------------------- */

export type MenuItemInput = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;

/**
 * The site leads with Somali, but `name.so` is empty on most imported records.
 * Rather than render a blank line, fall back to English for the lead and drop
 * the translation underneath.
 */
export function itemNames(item: MenuItem): { lead: string; sub: string } {
  const so = item.nameSo?.trim() ?? "";
  const en = item.nameEn?.trim() ?? "";
  if (so && en) return { lead: so, sub: en };
  return { lead: so || en || "Untitled", sub: "" };
}

export function itemDescription(item: MenuItem): { lead: string; sub: string } {
  const so = item.descriptionSo?.trim() ?? "";
  const en = item.descriptionEn?.trim() ?? "";
  if (so && en) return { lead: so, sub: en };
  return { lead: so || en, sub: "" };
}

function toMenuItem(snap: QueryDocumentSnapshot<DocumentData>): MenuItem {
  const d = snap.data();
  // Imported records nest the name; anything written since is read the same way.
  const name = (d.name ?? {}) as { en?: string; so?: string };
  const description = (d.description ?? {}) as { en?: string; so?: string };

  return {
    id: snap.id,
    nameEn: name.en ?? d.nameEn ?? "",
    nameSo: name.so ?? d.nameSo ?? "",
    descriptionEn: description.en ?? d.descriptionEn ?? "",
    descriptionSo: description.so ?? d.descriptionSo ?? "",
    price: typeof d.price === "number" ? d.price : Number(d.price) || 0,
    section: d.section ?? "",
    category: d.category ?? "",
    type: d.type ?? "Normal",
    image: d.image ?? d.imageUrl ?? "",
    imageSource: d.imageSource ?? "none",
    isActive: d.isActive !== false,
    popular: Boolean(d.popular),
    signature: Boolean(d.signature),
    createdAt: typeof d.createdAt === "string" ? d.createdAt : "",
    updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : "",
  };
}

/** The concrete value types a foodItems document holds — `unknown` here is not
 *  assignable to what updateDoc() accepts. */
type FoodDocValue = string | number | boolean | { en: string; so: string };

/** Writes back in the imported shape so old and new records stay identical. */
function toFirestore(input: Partial<MenuItemInput>): Record<string, FoodDocValue> {
  const out: Record<string, FoodDocValue> = {};

  if (input.nameEn !== undefined || input.nameSo !== undefined) {
    out.name = { en: input.nameEn ?? "", so: input.nameSo ?? "" };
  }
  if (input.descriptionEn !== undefined || input.descriptionSo !== undefined) {
    out.description = {
      en: input.descriptionEn ?? "",
      so: input.descriptionSo ?? "",
    };
  }
  if (input.price !== undefined) out.price = input.price;
  if (input.section !== undefined) out.section = input.section;
  if (input.category !== undefined) out.category = input.category;
  if (input.type !== undefined) out.type = input.type;
  if (input.image !== undefined) {
    out.image = input.image;
    // The importer tracked where each file came from; everything added now
    // is a plain link.
    out.imageSource = input.image ? "url" : "none";
  }
  if (input.isActive !== undefined) out.isActive = input.isActive;
  if (input.popular !== undefined) out.popular = input.popular;
  if (input.signature !== undefined) out.signature = input.signature;

  // ISO strings, matching every record already in the collection.
  out.updatedAt = new Date().toISOString();
  return out;
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const snap = await getDocs(query(collection(db, ITEMS)));
  return snap.docs
    .map(toMenuItem)
    .sort(
      (a, b) =>
        SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) ||
        a.category.localeCompare(b.category) ||
        a.nameEn.localeCompare(b.nameEn)
    );
}

export async function createMenuItem(input: MenuItemInput): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, ITEMS), {
    ...toFirestore(input),
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateMenuItem(
  id: string,
  input: Partial<MenuItemInput>
): Promise<void> {
  await updateDoc(doc(db, ITEMS, id), toFirestore(input));
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, ITEMS, id));
}

/* -------------------------------------------------------------------------- */

export interface MenuGroup {
  key: string;
  so: string;
  en: string;
  items: MenuItem[];
}

/** Groups into the five day-part sections, dropping any that are empty. */
export function groupBySection(items: MenuItem[]): MenuGroup[] {
  const keys = Array.from(new Set(items.map((i) => i.section))).sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a);
    const bi = SECTION_ORDER.indexOf(b);
    // Anything unrecognised sorts to the end rather than to the front.
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return keys
    .map((key) => ({
      key,
      ...sectionLabel(key),
      items: items.filter((i) => i.section === key),
    }))
    .filter((group) => group.items.length > 0);
}

/** Every section/category value actually present, for admin dropdowns. */
export function distinctSections(items: MenuItem[]): string[] {
  const found = new Set(items.map((i) => i.section).filter(Boolean));
  for (const key of Object.keys(SECTION_LABELS)) found.add(key);
  return Array.from(found).sort(
    (a, b) =>
      (SECTION_ORDER.indexOf(a) === -1 ? 99 : SECTION_ORDER.indexOf(a)) -
      (SECTION_ORDER.indexOf(b) === -1 ? 99 : SECTION_ORDER.indexOf(b))
  );
}

export function distinctCategories(items: MenuItem[]): string[] {
  const found = new Set(items.map((i) => i.category).filter(Boolean));
  for (const key of Object.keys(CATEGORY_LABELS)) found.add(key);
  return Array.from(found).sort();
}
