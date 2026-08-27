"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import {
  groupByCategory,
  listCategories,
  listMenuItems,
} from "@/lib/menu";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { SITE } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MenuRow } from "@/components/site/MenuRow";
import { EmptyState, ErrorNote, Skeleton } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { cn } from "@/lib/cn";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [error, setError] = useState("");
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    Promise.all([listMenuItems(), listCategories()])
      .then(([nextItems, nextCats]) => {
        setItems(nextItems);
        setCategories(nextCats);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load the menu. Refresh the page to try again.");
        setItems([]);
      });
  }, []);

  const groups = useMemo(
    () => groupByCategory(categories, items ?? []),
    [categories, items]
  );

  const shown = active ? groups.filter((g) => g.category.id === active) : groups;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-roasted text-bone">
        <div className="woven absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-roasted via-roasted/95 to-cilaan/30"
          aria-hidden
        />
        <Container className="relative">
          <div className="max-w-2xl py-24 sm:py-32">
            <p className="eyebrow text-xawaash">Menu-ga</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98]">
              Waxa aan kariyo
            </h1>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ciid/70">
              What we cook
            </p>
            <XawaashRule className="mt-5 max-w-xs text-xawaash" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ciid/85">
              Coffee roasted here, rice cooked here, samosas folded every
              morning. Prices in US dollars.
            </p>
          </div>
        </Container>
      </section>

      {/* Category filter */}
      {groups.length > 1 && (
        <div className="sticky top-[72px] z-40 border-y border-line bg-surface-raised/95 backdrop-blur-md">
          <Container>
            <div className="flex gap-1 overflow-x-auto py-3">
              <FilterChip
                label="All"
                active={active === ""}
                onClick={() => setActive("")}
              />
              {groups.map((g) => (
                <FilterChip
                  key={g.category.id}
                  label={g.category.nameEn}
                  active={active === g.category.id}
                  onClick={() => setActive(g.category.id)}
                />
              ))}
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
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ))}
            </div>
          ) : groups.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="The menu isn't online yet"
              description={`We're still putting it up. Call ${SITE.phone.display} or come in — the board by the counter has everything.`}
              action={
                <ButtonLink href={`tel:${SITE.phone.e164}`}>
                  Call {SITE.phone.display}
                </ButtonLink>
              }
            />
          ) : (
            <div className="flex flex-col gap-16">
              {shown.map(({ category, items: categoryItems }) => (
                <section key={category.id} id={category.id}>
                  <header className="flex flex-col gap-2">
                    <h2 className="font-display text-3xl leading-tight text-ink">
                      {category.nameSo}
                    </h2>
                    <p className="translation">{category.nameEn}</p>
                    <XawaashRule width="short" className="mt-1" />
                  </header>

                  <ul className="mt-6 divide-y divide-line">
                    {categoryItems.map((item) => (
                      <MenuRow key={item.id} item={item} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Photos, if any dish has one */}
      <MenuGallery items={items ?? []} />

      <Section tone="deep">
        <Container size="narrow" className="text-center">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Miis ma rabtaa?
          </h2>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-bone/60">
            Want a table?
          </p>
          <XawaashRule width="short" className="mx-auto mt-4 text-xawaash" />
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-bone/85">
            Walk in any day between {SITE.hours.en}, or let us know you&apos;re
            coming and we&apos;ll keep one free.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contactus">Book a table</ButtonLink>
            <ButtonLink
              href={`tel:${SITE.phone.e164}`}
              variant="inverse"
            >
              Call {SITE.phone.display}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-[2px] px-3.5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] transition-colors",
        active
          ? "bg-accent-solid text-accent-ink"
          : "text-ink-subtle hover:bg-surface-sunken hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}

/** Only renders when the kitchen has actually uploaded photos. */
function MenuGallery({ items }: { items: MenuItem[] }) {
  const withPhotos = items.filter((i) => i.imageUrl).slice(0, 6);
  if (withPhotos.length < 3) return null;

  return (
    <Section tone="sunken">
      <Container>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {withPhotos.map((item) => (
            <li
              key={item.id}
              className="group relative aspect-square overflow-hidden border border-line"
            >
              <Image
                src={item.imageUrl}
                alt={item.nameEn}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-roasted/90 to-transparent p-3">
                <span className="block font-display text-sm text-bone">
                  {item.nameSo}
                </span>
                <span className="block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ciid/70">
                  {item.nameEn}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
