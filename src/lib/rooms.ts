import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Room } from "./types";

const ROOMS = "rooms";

export type RoomInput = Omit<Room, "id" | "createdAt" | "updatedAt">;

function toRoom(snap: DocumentSnapshot<DocumentData>): Room {
  const d = snap.data() ?? {};
  return {
    id: snap.id,
    nameSo: d.nameSo ?? "",
    nameEn: d.nameEn ?? "",
    descriptionSo: d.descriptionSo ?? "",
    descriptionEn: d.descriptionEn ?? "",
    pricePerNight:
      typeof d.pricePerNight === "number"
        ? d.pricePerNight
        : Number(d.pricePerNight) || 0,
    capacity: typeof d.capacity === "number" ? d.capacity : 2,
    beds: typeof d.beds === "number" ? d.beds : 1,
    location: d.location ?? "",
    checkInTime: d.checkInTime ?? "14:00",
    checkOutTime: d.checkOutTime ?? "11:00",
    amenities: Array.isArray(d.amenities) ? d.amenities : [],
    images: Array.isArray(d.images) ? d.images : [],
    quantity: typeof d.quantity === "number" ? d.quantity : 1,
    active: d.active !== false,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
}

export async function listRooms(): Promise<Room[]> {
  const snap = await getDocs(
    query(collection(db, ROOMS), orderBy("pricePerNight"))
  );
  return snap.docs.map(toRoom);
}

export async function listActiveRooms(): Promise<Room[]> {
  return (await listRooms()).filter((r) => r.active);
}

export async function getRoom(id: string): Promise<Room | null> {
  const snap = await getDoc(doc(db, ROOMS, id));
  return snap.exists() ? toRoom(snap) : null;
}

export async function createRoom(input: RoomInput): Promise<string> {
  const ref = await addDoc(collection(db, ROOMS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRoom(
  id: string,
  input: Partial<RoomInput>
): Promise<void> {
  await updateDoc(doc(db, ROOMS, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRoom(id: string): Promise<void> {
  await deleteDoc(doc(db, ROOMS, id));
}

/** The amenity vocabulary the admin form offers, so entries stay consistent. */
export const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Air conditioning",
  "Private bathroom",
  "Hot water",
  "Breakfast included",
  "Desk",
  "Balcony",
  "Room service",
  "Daily housekeeping",
  "Safe",
  "Generator backup",
  "Street view",
];
