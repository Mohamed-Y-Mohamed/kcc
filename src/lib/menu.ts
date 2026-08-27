import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { MenuCategory, MenuItem } from "./types";

const ITEMS = "menuItems";
const CATEGORIES = "menuCategories";

export type MenuItemInput = Omit<
  MenuItem,
  "id" | "createdAt" | "updatedAt"
>;
export type MenuCategoryInput = Omit<MenuCategory, "id">;

function toMenuItem(snap: QueryDocumentSnapshot<DocumentData>): MenuItem {
  const d = snap.data();
  return {
    id: snap.id,
    nameSo: d.nameSo ?? "",
    nameEn: d.nameEn ?? "",
    descriptionSo: d.descriptionSo ?? "",
    descriptionEn: d.descriptionEn ?? "",
    price: typeof d.price === "number" ? d.price : Number(d.price) || 0,
    categoryId: d.categoryId ?? "",
    imageUrl: d.imageUrl ?? "",
    available: d.available !== false,
    popular: Boolean(d.popular),
    signature: Boolean(d.signature),
    order: typeof d.order === "number" ? d.order : 0,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
}

function toCategory(snap: QueryDocumentSnapshot<DocumentData>): MenuCategory {
  const d = snap.data();
  return {
    id: snap.id,
    nameSo: d.nameSo ?? "",
    nameEn: d.nameEn ?? "",
    order: typeof d.order === "number" ? d.order : 0,
  };
}

export async function listCategories(): Promise<MenuCategory[]> {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("order")));
  return snap.docs.map(toCategory);
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const snap = await getDocs(query(collection(db, ITEMS), orderBy("order")));
  return snap.docs.map(toMenuItem);
}

export async function createMenuItem(input: MenuItemInput): Promise<string> {
  const ref = await addDoc(collection(db, ITEMS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMenuItem(
  id: string,
  input: Partial<MenuItemInput>
): Promise<void> {
  await updateDoc(doc(db, ITEMS, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, ITEMS, id));
}

export async function createCategory(
  input: MenuCategoryInput
): Promise<string> {
  const ref = await addDoc(collection(db, CATEGORIES), input);
  return ref.id;
}

export async function updateCategory(
  id: string,
  input: Partial<MenuCategoryInput>
): Promise<void> {
  await updateDoc(doc(db, CATEGORIES, id), input);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES, id));
}

/** Groups items under their category, dropping categories with nothing in them. */
export function groupByCategory(
  categories: MenuCategory[],
  items: MenuItem[]
): { category: MenuCategory; items: MenuItem[] }[] {
  return categories
    .map((category) => ({
      category,
      items: items.filter((i) => i.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);
}
