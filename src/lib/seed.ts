import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Starter rooms, so the hotel side is not a blank page on day one.
 *
 * The food menu is deliberately not seeded — `foodItems` already holds 131
 * imported records. This only ever runs when `rooms` is completely empty.
 */
const ROOMS = [
  {
    nameSo: "Qol Keli ah",
    nameEn: "Single room",
    descriptionSo:
      "Qol yar oo nadiif ah, sariir keli ah, musqul gaar ah iyo biyo kulul.",
    descriptionEn:
      "A compact, quiet room with a single bed, private bathroom and hot water. Good for one traveller staying a night or two.",
    pricePerNight: 25,
    capacity: 1,
    beds: 1,
    location: "First floor, courtyard side",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: [
      "Wi-Fi",
      "Private bathroom",
      "Hot water",
      "Desk",
      "Generator backup",
    ],
    quantity: 4,
  },
  {
    nameSo: "Qol Laba Qof",
    nameEn: "Double room",
    descriptionSo:
      "Qol ballaadhan oo sariir weyn leh, qaboojiye iyo daaqad wadada dhinaceeda ah.",
    descriptionEn:
      "A larger room with a double bed, air conditioning and a window onto Argo Street. Breakfast in the cafe downstairs is included.",
    pricePerNight: 40,
    capacity: 2,
    beds: 1,
    location: "Second floor, street side",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: [
      "Wi-Fi",
      "Air conditioning",
      "Private bathroom",
      "Hot water",
      "Breakfast included",
      "Street view",
      "Generator backup",
    ],
    quantity: 3,
  },
  {
    nameSo: "Qol Qoys",
    nameEn: "Family room",
    descriptionSo:
      "Qol weyn oo saddex sariir leh, ku habboon qoys. Balakoon iyo adeeg qolka.",
    descriptionEn:
      "Our biggest room, with three beds and space for a family. Comes with a balcony, room service and daily housekeeping.",
    pricePerNight: 65,
    capacity: 5,
    beds: 3,
    location: "Top floor, corner with balcony",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: [
      "Wi-Fi",
      "Air conditioning",
      "Private bathroom",
      "Hot water",
      "Breakfast included",
      "Balcony",
      "Room service",
      "Daily housekeeping",
      "Safe",
    ],
    quantity: 2,
  },
];

export interface SeedResult {
  rooms: number;
  skipped: boolean;
}

/** Never overwrites. If any room already exists, this does nothing at all. */
export async function seedStarterRooms(): Promise<SeedResult> {
  const existing = await getDocs(query(collection(db, "rooms"), limit(1)));
  if (!existing.empty) return { rooms: 0, skipped: true };

  const batch = writeBatch(db);
  for (const room of ROOMS) {
    batch.set(doc(collection(db, "rooms")), {
      ...room,
      images: [],
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();

  return { rooms: ROOMS.length, skipped: false };
}
