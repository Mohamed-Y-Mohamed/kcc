import type { Role } from "./types";

/**
 * ---------------------------------------------------------------------------
 * OWNER ACCOUNT
 * ---------------------------------------------------------------------------
 * The owner is pinned to an email address rather than a database flag, so the
 * top of the hierarchy can never be taken away by whoever happens to be editing
 * the users collection.
 *
 * The same address is hardcoded in `firestore.rules` — that copy is the one
 * that actually enforces anything; this one only drives the UI. CHANGE BOTH
 * TOGETHER if the owner's email is different.
 */
export const OWNER_EMAIL = "theking19942010@gmail.com";

export const ROLES: Role[] = ["owner", "admin", "manager", "staff", "user"];

export const ROLE_META: Record<
  Role,
  { label: string; labelSo: string; summary: string }
> = {
  owner: {
    label: "Owner",
    labelSo: "Milkiilaha",
    summary: "Full control, and the only one who can appoint admins and managers.",
  },
  admin: {
    label: "Admin",
    labelSo: "Maamule Sare",
    summary: "Rooms, menu and bookings. Can appoint staff.",
  },
  manager: {
    label: "Manager",
    labelSo: "Maamule",
    summary: "Rooms, menu and bookings. Can appoint staff, but not managers.",
  },
  staff: {
    label: "Staff",
    labelSo: "Shaqaale",
    summary: "Bookings and messages only — edit and cancel for guests.",
  },
  user: {
    label: "Customer",
    labelSo: "Macmiil",
    summary: "An ordinary account. Books rooms, sees their own bookings.",
  },
};

export type Capability =
  | "manageRooms"
  | "manageMenu"
  | "manageBookings"
  | "manageMessages"
  | "manageUsers"
  | "seedContent";

/**
 * Written out per role rather than derived from a rank, because the hierarchy
 * is not a straight ladder: a manager runs rooms and the menu but cannot
 * appoint another manager — that stays with the owner.
 */
const CAPABILITIES: Record<Role, Capability[]> = {
  owner: [
    "manageRooms",
    "manageMenu",
    "manageBookings",
    "manageMessages",
    "manageUsers",
    "seedContent",
  ],
  admin: [
    "manageRooms",
    "manageMenu",
    "manageBookings",
    "manageMessages",
    "manageUsers",
    "seedContent",
  ],
  manager: [
    "manageRooms",
    "manageMenu",
    "manageBookings",
    "manageMessages",
    "manageUsers",
  ],
  staff: ["manageBookings", "manageMessages"],
  user: [],
};

/**
 * Who each role may appoint. Note that only the owner can create an admin or a
 * manager — admins and managers can appoint staff and nothing above it.
 */
const ASSIGNABLE: Record<Role, Role[]> = {
  owner: ["admin", "manager", "staff", "user"],
  admin: ["staff", "user"],
  manager: ["staff", "user"],
  staff: [],
  user: [],
};

export function can(role: Role | undefined, capability: Capability): boolean {
  if (!role) return false;
  return CAPABILITIES[role]?.includes(capability) ?? false;
}

export function assignableRoles(role: Role | undefined): Role[] {
  if (!role) return [];
  return ASSIGNABLE[role] ?? [];
}

/** Anyone with a reason to open the dashboard at all. */
export function hasDashboardAccess(role: Role | undefined): boolean {
  return Boolean(role && role !== "user");
}

/** Nobody may change the owner's role, including the owner. */
export function canChangeRoleOf(
  actor: Role | undefined,
  target: Role,
  targetIsOwnerEmail: boolean
): boolean {
  if (targetIsOwnerEmail || target === "owner") return false;
  return assignableRoles(actor).length > 0;
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  return Boolean(email) && email!.toLowerCase() === OWNER_EMAIL.toLowerCase();
}
