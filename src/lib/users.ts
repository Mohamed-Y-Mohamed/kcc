import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "./firebase";
import { isOwnerEmail } from "./roles";
import type { AppUser, Role } from "./types";

const USERS = "users";

const KNOWN_ROLES: Role[] = ["owner", "admin", "manager", "staff", "user"];

function toAppUser(snap: DocumentSnapshot<DocumentData>): AppUser {
  const d = snap.data() ?? {};
  const stored = d.role as Role | undefined;
  return {
    uid: snap.id,
    email: d.email ?? "",
    displayName: d.displayName ?? "",
    phone: d.phone ?? "",
    // Anything unrecognised falls back to the least privileged role.
    role: stored && KNOWN_ROLES.includes(stored) ? stored : "user",
    createdAt: d.createdAt ?? null,
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? toAppUser(snap) : null;
}

/**
 * Called on sign-up and on every sign-in. Note it never writes `role` on an
 * existing document — otherwise signing in would quietly demote an admin back
 * to "user" on every visit.
 */
export async function ensureUserProfile(
  user: FirebaseUser,
  extras: { displayName?: string; phone?: string } = {}
): Promise<AppUser> {
  const ref = doc(db, USERS, user.uid);
  const existing = await getDoc(ref);
  const owner = isOwnerEmail(user.email);

  if (existing.exists()) {
    const patch: { displayName?: string; phone?: string; role?: Role } = {};
    if (extras.displayName) patch.displayName = extras.displayName;
    if (extras.phone) patch.phone = extras.phone;
    // The owner's account self-heals to owner on sign-in, so the top of the
    // hierarchy can't be lost by an accidental edit. Rules allow this only for
    // the pinned owner email.
    if (owner && existing.data()?.role !== "owner") patch.role = "owner";
    if (Object.keys(patch).length) await updateDoc(ref, patch);
    return toAppUser(await getDoc(ref));
  }

  await setDoc(ref, {
    email: user.email ?? "",
    displayName: extras.displayName || user.displayName || "",
    phone: extras.phone || "",
    role: owner ? "owner" : "user",
    createdAt: serverTimestamp(),
  });
  return toAppUser(await getDoc(ref));
}

export async function updateOwnProfile(
  uid: string,
  patch: { displayName?: string; phone?: string }
): Promise<void> {
  await updateDoc(doc(db, USERS, uid), patch);
}

export async function listUsers(max = 500): Promise<AppUser[]> {
  const snap = await getDocs(
    query(collection(db, USERS), orderBy("createdAt", "desc"), limit(max))
  );
  return snap.docs.map(toAppUser);
}

export async function setUserRole(uid: string, role: Role): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { role });
}

/**
 * Firestore has no substring search. For a restaurant's user list — hundreds,
 * not millions — filtering the loaded page in memory is the right trade rather
 * than standing up a search service.
 */
export function filterUsers(users: AppUser[], term: string): AppUser[] {
  const q = term.trim().toLowerCase();
  if (!q) return users;
  return users.filter(
    (u) =>
      u.email.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
  );
}
