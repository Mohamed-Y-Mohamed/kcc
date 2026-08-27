import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateBookingCode, nightsBetween, todayISO } from "./format";
import type { Booking, BookingStatus, DateBlock, Room } from "./types";

const BOOKINGS = "bookings";
const BLOCKS = "dateBlocks";

/** Statuses that occupy a room. Cancelled bookings free it back up. */
const OCCUPYING: BookingStatus[] = ["pending", "confirmed", "completed"];

function toBooking(snap: QueryDocumentSnapshot<DocumentData>): Booking {
  const d = snap.data();
  return {
    id: snap.id,
    code: d.code ?? "",
    roomId: d.roomId ?? "",
    roomName: d.roomName ?? "",
    guestName: d.guestName ?? "",
    guestEmail: d.guestEmail ?? "",
    guestPhone: d.guestPhone ?? "",
    checkIn: d.checkIn ?? "",
    checkOut: d.checkOut ?? "",
    nights: typeof d.nights === "number" ? d.nights : 0,
    guests: typeof d.guests === "number" ? d.guests : 1,
    pricePerNight:
      typeof d.pricePerNight === "number" ? d.pricePerNight : 0,
    total: typeof d.total === "number" ? d.total : 0,
    status: (d.status as BookingStatus) ?? "pending",
    userId: d.userId ?? null,
    notes: d.notes ?? "",
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
}

function toBlock(snap: QueryDocumentSnapshot<DocumentData>): DateBlock {
  const d = snap.data();
  return {
    id: snap.id,
    roomId: d.roomId ?? "",
    checkIn: d.checkIn ?? "",
    checkOut: d.checkOut ?? "",
    status: (d.status as BookingStatus) ?? "pending",
  };
}

/**
 * Two ranges overlap when each starts before the other ends. Checkout day is
 * exclusive, so a guest leaving on the 5th and one arriving on the 5th do not
 * clash.
 */
function overlaps(
  aIn: string,
  aOut: string,
  bIn: string,
  bOut: string
): boolean {
  return aIn < bOut && aOut > bIn;
}

export interface Availability {
  total: number;
  booked: number;
  remaining: number;
  available: boolean;
}

/**
 * Reads the PII-free `dateBlocks` mirror rather than `bookings`, so an
 * unauthenticated guest can check availability without being able to read
 * anyone's name, email or phone number.
 */
export async function checkAvailability(
  room: Room,
  checkIn: string,
  checkOut: string
): Promise<Availability> {
  // One equality + one range keeps this on a single composite index.
  const snap = await getDocs(
    query(
      collection(db, BLOCKS),
      where("roomId", "==", room.id),
      where("checkOut", ">", checkIn)
    )
  );

  const booked = snap.docs
    .map(toBlock)
    .filter(
      (b) =>
        OCCUPYING.includes(b.status) &&
        overlaps(b.checkIn, b.checkOut, checkIn, checkOut)
    ).length;

  const remaining = Math.max(0, room.quantity - booked);
  return {
    total: room.quantity,
    booked,
    remaining,
    available: remaining > 0,
  };
}

export interface BookingRequest {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
  userId: string | null;
}

export class BookingError extends Error {}

/**
 * Writes the booking and its public date block in one batch — a booking that
 * exists without a block would be invisible to availability checks and the
 * room would get double-sold.
 */
export async function createBooking(req: BookingRequest): Promise<Booking> {
  const nights = nightsBetween(req.checkIn, req.checkOut);

  if (req.checkIn < todayISO()) {
    throw new BookingError("Check-in cannot be in the past.");
  }
  if (nights < 1) {
    throw new BookingError("Check-out must be at least one night after check-in.");
  }
  if (req.guests < 1 || req.guests > req.room.capacity) {
    throw new BookingError(
      `This room takes up to ${req.room.capacity} guests.`
    );
  }

  // Re-check right before writing. The form checked earlier, but someone else
  // may have booked the last room in the meantime.
  const availability = await checkAvailability(
    req.room,
    req.checkIn,
    req.checkOut
  );
  if (!availability.available) {
    throw new BookingError(
      "That room was just taken for those dates. Please pick different dates."
    );
  }

  const ref = doc(collection(db, BOOKINGS));
  const booking: Omit<Booking, "createdAt" | "updatedAt"> = {
    id: ref.id,
    code: generateBookingCode(),
    roomId: req.room.id,
    roomName: req.room.nameEn,
    guestName: req.guestName.trim(),
    guestEmail: req.guestEmail.trim().toLowerCase(),
    guestPhone: req.guestPhone.trim(),
    checkIn: req.checkIn,
    checkOut: req.checkOut,
    nights,
    guests: req.guests,
    pricePerNight: req.room.pricePerNight,
    total: nights * req.room.pricePerNight,
    status: "pending",
    userId: req.userId,
    notes: req.notes.trim(),
  };

  const batch = writeBatch(db);
  batch.set(ref, {
    ...booking,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Same document id in both collections keeps them trivially in sync.
  batch.set(doc(db, BLOCKS, ref.id), {
    roomId: booking.roomId,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    status: booking.status,
  });
  await batch.commit();

  return { ...booking, createdAt: null, updatedAt: null };
}

export async function listBookings(max = 300): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, BOOKINGS), orderBy("createdAt", "desc"), limit(max))
  );
  return snap.docs.map(toBooking);
}

/** Rules allow this because the query filter matches the ownership rule. */
export async function listBookingsForUser(userId: string): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, BOOKINGS), where("userId", "==", userId))
  );
  return snap.docs
    .map(toBooking)
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}

/** Status lives on both documents, so both move together. */
export async function setBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, BOOKINGS, id), { status, updatedAt: serverTimestamp() });
  batch.update(doc(db, BLOCKS, id), { status });
  await batch.commit();
}

export async function updateBookingNotes(
  id: string,
  notes: string
): Promise<void> {
  await updateDoc(doc(db, BOOKINGS, id), {
    notes,
    updatedAt: serverTimestamp(),
  });
}

/** A guest may still call off a stay that has not started. */
export function canGuestCancel(booking: Booking): boolean {
  return (
    (booking.status === "pending" || booking.status === "confirmed") &&
    booking.checkIn > todayISO()
  );
}

/**
 * Cancelling from the account page. Rules only permit the owner to move their
 * own booking to `cancelled` and to touch nothing else, so this cannot be used
 * to edit dates or price.
 */
export async function cancelOwnBooking(booking: Booking): Promise<void> {
  if (!canGuestCancel(booking)) {
    throw new BookingError(
      "This stay can no longer be cancelled online. Call us on +252 61 067 3194."
    );
  }

  const batch = writeBatch(db);
  batch.update(doc(db, BOOKINGS, booking.id), {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });
  // Frees the room again for everyone else's availability check.
  batch.update(doc(db, BLOCKS, booking.id), { status: "cancelled" });
  await batch.commit();
}
