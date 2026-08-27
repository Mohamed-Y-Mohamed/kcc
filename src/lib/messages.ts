import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { ContactMessage, MessageStatus } from "./types";

const MESSAGES = "messages";

export type ContactMessageInput = Omit<
  ContactMessage,
  "id" | "status" | "createdAt"
>;

function toMessage(snap: QueryDocumentSnapshot<DocumentData>): ContactMessage {
  const d = snap.data();
  return {
    id: snap.id,
    name: d.name ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    partySize: typeof d.partySize === "number" ? d.partySize : 0,
    date: d.date ?? "",
    time: d.time ?? "",
    occasion: d.occasion ?? "",
    message: d.message ?? "",
    status: (d.status as MessageStatus) ?? "new",
    createdAt: d.createdAt ?? null,
  };
}

export async function sendMessage(
  input: ContactMessageInput
): Promise<string> {
  const ref = await addDoc(collection(db, MESSAGES), {
    ...input,
    email: input.email.trim().toLowerCase(),
    status: "new" satisfies MessageStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listMessages(max = 200): Promise<ContactMessage[]> {
  const snap = await getDocs(
    query(collection(db, MESSAGES), orderBy("createdAt", "desc"), limit(max))
  );
  return snap.docs.map(toMessage);
}

export async function setMessageStatus(
  id: string,
  status: MessageStatus
): Promise<void> {
  await updateDoc(doc(db, MESSAGES, id), { status });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, MESSAGES, id));
}
