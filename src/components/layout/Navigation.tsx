"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  User as UserIcon,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/", so: "Guriga", en: "Home" },
  { href: "/menu", so: "Menu", en: "Menu" },
  { href: "/hotel", so: "Hoteel", en: "Hotel" },
  { href: "/aboutus", so: "Ku Saabsan", en: "About" },
  { href: "/contactus", so: "Xiriir", en: "Contact" },
];

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isStaff, signOutUser } = useAuth();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Only the landing page has a full-bleed hero to sit over.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route changes should always close the menus, otherwise they hang open
  // over the new page.
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-account-menu]")) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [accountOpen]);

  const solid = scrolled || !overHero || mobileOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-accent-solid focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-300",
          solid
            ? "border-b border-line bg-surface/92 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-roasted/55 to-transparent"
        )}
      >
        <Container size="wide">
          <div className="flex h-[72px] items-center justify-between gap-4">
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="KCC — home"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[3px] border border-accent-solid/40">
                <Image
                  src="/logo.jpeg"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className={cn(
                    "font-display text-lg tracking-tight transition-colors",
                    solid ? "text-ink" : "text-bone"
                  )}
                >
                  KCC
                </span>
                {/* Hidden on the narrowest phones, where it wrapped and
                    squeezed the buttons in the bar. */}
                <span
                  className={cn(
                    "mt-1 hidden whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors min-[420px]:block",
                    solid ? "text-ink-subtle" : "text-ciid"
                  )}
                >
                  Qaxwo &amp; Cunto
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Main"
            >
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex flex-col items-center rounded-[2px] px-3 py-2 transition-colors",
                      solid
                        ? active
                          ? "text-accent"
                          : "text-ink-muted hover:text-ink"
                        : active
                        ? "text-accent-solid"
                        : "text-bone/85 hover:text-bone"
                    )}
                  >
                    <span className="font-display text-[0.95rem] leading-none">
                      {item.so}
                    </span>
                    <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.18em] opacity-70">
                      {item.en}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ButtonLink
                href="/hotel"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Book a room
              </ButtonLink>

              <button
                onClick={toggleTheme}
                aria-label={
                  theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-[2px] transition-colors",
                  solid
                    ? "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                    : "text-bone/90 hover:bg-bone/10"
                )}
              >
                {theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </button>

              {/* Account */}
              {user ? (
                <div className="relative hidden sm:block" data-account-menu>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                    className={cn(
                      "flex h-11 items-center gap-1.5 rounded-[2px] px-2.5 text-sm transition-colors",
                      solid
                        ? "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                        : "text-bone/90 hover:bg-bone/10"
                    )}
                  >
                    <UserIcon className="h-[18px] w-[18px]" />
                    <span className="max-w-[8rem] truncate">
                      {profile?.displayName || user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {accountOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 w-56 border border-line bg-surface-raised py-1 shadow-[var(--shadow-raised)]"
                    >
                      <p className="border-b border-line px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-subtle">
                        {user.email}
                      </p>
                      <Link
                        href="/account"
                        role="menuitem"
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink hover:bg-surface-sunken"
                      >
                        <UserIcon className="h-4 w-4" /> My bookings
                      </Link>
                      {isStaff && (
                        <Link
                          href="/admin"
                          role="menuitem"
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-deep hover:bg-surface-sunken"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                        </Link>
                      )}
                      <button
                        role="menuitem"
                        onClick={() => signOutUser()}
                        className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-left text-sm text-ink-muted hover:bg-surface-sunken hover:text-ink"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "hidden h-11 items-center rounded-[2px] px-3 text-sm transition-colors sm:flex",
                    solid
                      ? "text-ink-muted hover:text-ink"
                      : "text-bone/90 hover:text-bone"
                  )}
                >
                  Sign in
                </Link>
              )}

              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-[2px] transition-colors lg:hidden",
                  solid
                    ? "text-ink hover:bg-surface-sunken"
                    : "text-bone hover:bg-bone/10"
                )}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-line bg-surface lg:hidden">
            <Container size="wide">
              <nav className="flex flex-col py-3" aria-label="Mobile">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-baseline justify-between border-b border-line/60 py-3.5 last:border-0"
                  >
                    <span className="font-display text-lg text-ink">
                      {item.so}
                    </span>
                    <span className="translation">{item.en}</span>
                  </Link>
                ))}

                <div className="mt-4 flex flex-col gap-2 pb-4">
                  <ButtonLink href="/hotel" size="md">
                    Book a room
                  </ButtonLink>
                  {user ? (
                    <>
                      <ButtonLink href="/account" variant="secondary" size="md">
                        My bookings
                      </ButtonLink>
                      {isStaff && (
                        <ButtonLink href="/admin" variant="deep" size="md">
                          Admin dashboard
                        </ButtonLink>
                      )}
                      <button
                        onClick={() => signOutUser()}
                        className="h-11 text-sm text-ink-muted underline underline-offset-4"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <ButtonLink href="/login" variant="secondary" size="md">
                        Sign in
                      </ButtonLink>
                      <ButtonLink href="/signup" variant="ghost" size="md">
                        Create an account
                      </ButtonLink>
                    </>
                  )}
                </div>
              </nav>
            </Container>
          </div>
        )}
      </header>

      {/* Keeps content clear of the fixed header everywhere but the hero. */}
      {!overHero && <div className="h-[72px]" aria-hidden />}
    </>
  );
}
