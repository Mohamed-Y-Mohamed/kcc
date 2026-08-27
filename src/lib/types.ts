import type { Timestamp } from "firebase/firestore";

/**
 * `user` is the ordinary customer. It keeps its original name so existing
 * documents don't need migrating. See `roles.ts` for what each one may do.
 */
export type Role = "owner" | "admin" | "manager" | "staff" | "user";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: Role;
  createdAt: Timestamp | null;
}

/**
 * Mirrors the existing `foodItems` collection, which was imported before this
 * rebuild. Its shape is not what we would have designed — names live in a `name`
 * map, timestamps are ISO strings, and images point at Supabase — but there are
 * 131 real records in it, so the code bends to the data rather than the reverse.
 *
 * `src/lib/menu.ts` does the translation; nothing above it sees the raw shape.
 */
export interface MenuItem {
  id: string;
  nameEn: string;
  /** Often empty in the imported data — always fall back to English. */
  nameSo: string;
  descriptionEn: string;
  descriptionSo: string;
  /** Stored as a number so totals and sorting are arithmetic, not string work. */
  price: number;
  /** Top-level grouping: breakfast | lunch | dinner | sides | drinks */
  section: string;
  /** Sub-type within a section: lunch-food, hot-tea, juice, … */
  category: string;
  type: string;
  image: string;
  imageSource: string;
  isActive: boolean;
  popular: boolean;
  signature: boolean;
  /** ISO strings, matching the imported records. */
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  nameSo: string;
  nameEn: string;
  descriptionSo: string;
  descriptionEn: string;
  pricePerNight: number;
  capacity: number;
  beds: number;
  /** Where in the building — "Second floor, street side". Shown to guests. */
  location: string;
  /** `HH:mm`. Per room, because the suite may differ from the singles. */
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  /** First image is the one used as the card and hero. */
  images: string[];
  /** How many physical rooms of this type exist — drives availability. */
  quantity: number;
  /** Off hides the room from guests without deleting its booking history. */
  active: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

export interface Booking {
  id: string;
  /** Short human-readable code a guest can quote on the phone. */
  code: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  /** ISO `yyyy-mm-dd`. Sorts and range-queries correctly as a plain string. */
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  total: number;
  status: BookingStatus;
  /** null for guest bookings made without an account. */
  userId: string | null;
  notes: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

/**
 * A PII-free mirror of a booking's date range, written in the same batch.
 * Guests need to see what is free without being able to read other people's
 * names, emails and phone numbers — so availability reads hit this collection
 * and never `bookings`.
 */
export interface DateBlock {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
}

export type MessageStatus = "new" | "read" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  occasion: string;
  message: string;
  status: MessageStatus;
  createdAt: Timestamp | null;
}
