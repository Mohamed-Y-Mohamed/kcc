"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, UtensilsCrossed } from "lucide-react";
import {
  categoryLabel,
  groupBySection,
  itemNames,
  listMenuItems,
} from "@/lib/menu";
import type { MenuItem } from "@/lib/types";
import { SITE } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MenuRow } from "@/components/site/MenuRow";
import { EmptyState, ErrorNote, Skeleton } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { cn } from "@/lib/cn";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState("");
  const [section, setSection] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    listMenuItems()
      .then(setItems)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load the menu. Refresh the page to try again.");
        setItems([]);
      });
  }, []);

  // Guests should never see something that isn't being served today.
  const available = useMemo(
    () => (items ?? []).filter((i) => i.isActive),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return available.filter((i) => {
      if (section && i.section !== section) return false;
      if (!q) return true;
      return (
        i.nameEn.toLowerCase().includes(q) ||
        i.nameSo.toLowerCase().includes(q) ||
        categoryLabel(i.category).en.toLowerCase().includes(q)
      );
    });
  }, [available, section, search]);

  const allGroups = useMemo(() => groupBySection(available), [available]);
  const groups = useMemo(() => groupBySection(filtered), [filtered]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-qaxwo text-caano">
        <div className="woven absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-qaxwo via-qaxwo/95 to-bun/30"
          aria-hidden
        />
        <Container className="relative">
          <div className="max-w-2xl py-24 sm:py-32">
            <p className="eyebrow text-guduud">Menu-ga</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98]">
              Waxa aan kariyo
            </h1>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ciid/70">
              What we cook
            </p>
            <XawaashRule className="mt-5 max-w-xs text-guduud" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ciid/85">
              Quraac, qado, casho iyo cabitaan. Breakfast through to dinner,
              plus everything from the tea counter.
            </p>
          </div>
        </Container>
      </section>

      {/* Section filter + search */}
      {allGroups.length > 0 && (
        <div className="sticky top-[72px] z-40 border-y border-line bg-surface-raised/95 backdrop-blur-md">
          <Container>
            <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
                <FilterChip
                  so="Dhammaan"
                  en="All"
                  active={section === ""}
                  onClick={() => setSection("")}
                />
                {allGroups.map((g) => (
                  <FilterChip
                    key={g.key}
                    so={g.so}
                    en={g.en}
                    active={section === g.key}
                    onClick={() => setSection(g.key)}
                  />
                ))}
              </div>

              <div className="relative w-full lg:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search the menu"
                  placeholder="Raadi · Search…"
                  className="h-10 w-full rounded-[2px] border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle"
                />
              </div>
            </div>
          </Container>
        </div>
      )}

      <Section tone="surface">
        <Container size="narrow">
          {error && <ErrorNote message={error} />}

          {items === null ? (
            <div className="flex flex-col gap-10">
              {[0, 1].map((g) => (
                <div key={g} className="flex flex-col gap-4">
                  <Skeleton className="h-8 w-48" />
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ))}
            </div>
          ) : available.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="The menu isn't online yet"
              description={`Call ${SITE.phone.display} or come in — the board by the counter has everything.`}
              action={
                <ButtonLink href={`tel:${SITE.phone.e164}`}>
                  Call {SITE.phone.display}
                </ButtonLink>
              }
            />
          ) : groups.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nothing matches that"
              description="Try a different word, or clear the search to see the whole menu."
            />
          ) : (
            <div className="flex flex-col gap-16">
              {groups.map((group) => (
                <section key={group.key} id={group.key}>
                  <header className="flex flex-col gap-2">
                    <h2 className="font-display text-3xl leading-tight text-ink">
                      {group.so}
                    </h2>
                    <p className="translation">
                      {group.en} · {group.items.length}{" "}
                      {group.items.length === 1 ? "item" : "items"}
                    </p>
                    <XawaashRule width="short" className="mt-1" />
                  </header>

                  <CategoryGroups items={group.items} />
                </section>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <MenuGallery items={available} />

      <Section tone="deep">
        <Container size="narrow" className="text-center">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Miis ma rabtaa?
          </h2>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-caano/60">
            Want a table?
          </p>
          <XawaashRule width="short" className="mx-auto mt-4 text-guduud" />
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-caano/85">
            Walk in any day between {SITE.hours.en}, or let us know you&apos;re
            coming and we&apos;ll keep one free.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contactus">Book a table</ButtonLink>
            <ButtonLink href={`tel:${SITE.phone.e164}`} variant="inverse">
              Call {SITE.phone.display}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Within a day-part, break the list up by category — a run of forty unlabelled
 * dishes is unreadable, and the categories are already on the data.
 */
function CategoryGroups({ items }: { items: MenuItem[] }) {
  const categories = Array.from(new Set(items.map((i) => i.category))).sort();

  // One category is no grouping at all — just list them.
  if (categories.length <= 1) {
    return (
      <ul className="mt-6 divide-y divide-line">
        {items.map((item) => (
          <MenuRow key={item.id} item={item} />
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-9">
      {categories.map((key) => {
        const label = categoryLabel(key);
        return (
          <div key={key}>
            <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
              {label.so} · {label.en}
            </h3>
            <ul className="mt-2 divide-y divide-line">
              {items
                .filter((i) => i.category === key)
                .map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function FilterChip({
  so,
  en,
  active,
  onClick,
}: {
  so: string;
  en: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-[2px] px-3.5 py-2 text-left transition-colors",
        active
          ? "bg-accent-solid text-accent-ink"
          : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
      )}
    >
      <span className="block font-display text-sm leading-none">{so}</span>
      <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.16em] opacity-70">
        {en}
      </span>
    </button>
  );
}

/** Only renders when items actually have photos. */
function MenuGallery({ items }: { items: MenuItem[] }) {
  const withPhotos = items.filter((i) => i.image).slice(0, 6);
  if (withPhotos.length < 3) return null;

  return (
    <Section tone="sunken">
      <Container>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {withPhotos.map((item) => {
            const name = itemNames(item);
            return (
              <li
                key={item.id}
                className="group relative aspect-square overflow-hidden border border-line"
              >
                <Image
                  src={item.image}
                  alt={item.nameEn}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-qaxwo/90 to-transparent p-3">
                  <span className="block font-display text-sm text-caano">
                    {name.lead}
                  </span>
                  {name.sub && (
                    <span className="block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ciid/70">
                      {name.sub}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
