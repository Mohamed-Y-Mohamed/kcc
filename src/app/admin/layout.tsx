"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu as MenuIcon,
  ShieldAlert,
  Store,
  UserRound,
  UtensilsCrossed,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OWNER_EMAIL, ROLE_META, type Capability } from "@/lib/roles";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/Feedback";
import { RoleBadge } from "@/components/ui/Badge";

type IconProps = { className?: string; strokeWidth?: number };

const NAV: {
  href: string;
  label: string;
  labelSo: string;
  icon: React.ComponentType<IconProps>;
  exact?: boolean;
  capability?: Capability;
}[] = [
  {
    href: "/admin",
    label: "Overview",
    labelSo: "Guudmar",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    labelSo: "Qabsasho",
    icon: CalendarCheck,
    capability: "manageBookings",
  },
  {
    href: "/admin/rooms",
    label: "Rooms",
    labelSo: "Qolalka",
    icon: BedDouble,
    capability: "manageRooms",
  },
  {
    href: "/admin/menu",
    label: "Food & drink",
    labelSo: "Cunto & Cabitaan",
    icon: UtensilsCrossed,
    capability: "manageMenu",
  },
  {
    href: "/admin/users",
    label: "Users",
    labelSo: "Isticmaalayaal",
    icon: Users,
    capability: "manageUsers",
  },
  {
    href: "/admin/messages",
    label: "Tables & messages",
    labelSo: "Miisas & Fariimo",
    icon: Mail,
    capability: "manageMessages",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, role, isStaff, can, loading, signOutUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  // The sign-in door lives under /admin but must render before the guard,
  // otherwise there is no way to ever get in.
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginRoute) router.replace("/admin/login");
  }, [loading, user, isLoginRoute, router]);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  if (isLoginRoute) return <>{children}</>;

  if (loading) return <LoadingBlock label="Checking your access" />;
  if (!user) return <LoadingBlock label="Redirecting to sign in" />;

  if (!isStaff) return <NoAccess email={user.email ?? ""} />;

  const visible = NAV.filter((item) => !item.capability || can(item.capability));

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-line bg-deep-solid px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="relative h-8 w-8 overflow-hidden rounded-[3px]">
            <Image src="/logo.jpeg" alt="" fill sizes="32px" className="object-cover" />
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-caano">
            KCC Admin
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-label="View customer site"
            className="flex h-10 w-10 items-center justify-center text-guduud"
          >
            <Store className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="flex h-10 w-10 items-center justify-center text-caano"
          >
            {navOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "flex-col justify-between bg-deep-solid text-caano lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0",
          navOpen ? "flex" : "hidden"
        )}
      >
        <div>
          <Link
            href="/admin"
            className="hidden items-center gap-3 border-b border-caano/10 px-5 py-5 lg:flex"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-[3px] border border-guduud/40">
              <Image src="/logo.jpeg" alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg">KCC</span>
              <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-caano/50">
                Back of house
              </span>
            </span>
          </Link>

          <nav className="flex flex-col p-3" aria-label="Admin">
            {visible.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[2px] px-3 py-2.5 transition-colors",
                    active
                      ? // White on the brand red, not brown — brown-on-red is
                        // only 3.8:1 and this is small text.
                        "bg-guduud text-white"
                      : "text-caano/75 hover:bg-caano/10 hover:text-caano"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className="font-display text-[0.95rem]">
                      {item.labelSo}
                    </span>
                    <span
                      className={cn(
                        "mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em]",
                        active ? "text-white/75" : "opacity-60"
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-caano/10 p-3">
          {/* The way back to the customer side. Staff land in here on sign-in,
              so this needs to be obvious rather than a quiet link. */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-[2px] border border-guduud/60 px-3 py-2.5 text-[#ff6152] transition-colors hover:bg-guduud hover:text-white"
          >
            <Store className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[0.95rem]">
                Eeg bogga macmiilka
              </span>
              <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] opacity-70">
                View customer site
              </span>
            </span>
          </Link>

          <div className="mt-3 flex flex-col gap-2 border-t border-caano/10 px-3 pt-3">
            <p className="truncate text-sm text-caano/80">
              {profile?.displayName || user.email}
            </p>
            <RoleBadge role={role} />
          </div>

          <Link
            href="/account"
            className="mt-1 flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-caano/75 transition-colors hover:bg-caano/10 hover:text-caano"
          >
            <UserRound className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex flex-col leading-none">
              <span className="text-sm">Akoonkayga</span>
              <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] opacity-60">
                My account
              </span>
            </span>
          </Link>

          <button
            onClick={async () => {
              await signOutUser();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-[2px] px-3 py-2.5 text-left text-caano/75 transition-colors hover:bg-caano/10 hover:text-caano"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex flex-col leading-none">
              <span className="text-sm">Ka bax</span>
              <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] opacity-60">
                Sign out
              </span>
            </span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}

/**
 * Signed in, but this account has no back-of-house role. Says exactly how to
 * fix it — most people landing here are a new staff member waiting on the owner.
 */
function NoAccess({ email }: { email: string }) {
  const { signOutUser } = useAuth();
  const isOwnerAddress = email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="max-w-lg border border-line bg-surface-raised p-8">
        <ShieldAlert className="h-8 w-8 text-accent" strokeWidth={1.5} />
        <h1 className="mt-5 font-display text-3xl text-ink">
          This account isn&apos;t staff
        </h1>
        <p className="translation mt-1.5">Back-of-house access required</p>

        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          You&apos;re signed in as{" "}
          <span className="font-mono text-ink">{email}</span>, which is a
          customer account.
        </p>

        {isOwnerAddress ? (
          <div className="mt-5 border border-accent-solid/40 bg-accent-solid/5 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
              This is the owner address
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Sign out and back in — the owner role is applied automatically on
              sign-in. If it still doesn&apos;t work, the rules haven&apos;t been
              deployed yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 border border-line bg-surface-sunken p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
              Getting access
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Ask the owner or a manager to open{" "}
              <span className="font-mono text-ink">Admin → Users</span>, search
              for <span className="font-mono text-ink">{email}</span>, and give
              you a role.
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs text-ink-subtle">
              {(["admin", "manager", "staff"] as const).map((r) => (
                <li key={r}>
                  <span className="font-medium text-ink-muted">
                    {ROLE_META[r].label}
                  </span>{" "}
                  — {ROLE_META[r].summary}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/">Back to the site</ButtonLink>
          <ButtonLink href="/account" variant="secondary">
            My bookings
          </ButtonLink>
          <Button variant="ghost" onClick={() => signOutUser()}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
