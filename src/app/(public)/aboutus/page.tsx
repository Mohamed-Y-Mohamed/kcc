"use client";

import React from "react";
import Image from "next/image";
import { BedDouble, Coffee, Flame, UtensilsCrossed } from "lucide-react";
import { SITE } from "@/lib/site";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { XawaashRule } from "@/components/ui/XawaashRule";

/**
 * Copy here sticks to what is verifiable about the business — the address, the
 * hours, what is served. Anything about founding dates or family history is the
 * owner's to add.
 */
const HOW_IT_WORKS = [
  {
    icon: Flame,
    so: "Bunka",
    en: "The roast",
    body: "We roast in small batches in a pan out the back, the way it has always been done here. Cardamom and cinnamon go in at the end, not the beginning.",
  },
  {
    icon: UtensilsCrossed,
    so: "Jikada",
    en: "The kitchen",
    body: "Rice goes on early. Samosas are folded each morning and fried to order. Nothing sits under a lamp waiting for you.",
  },
  {
    icon: BedDouble,
    so: "Qolalka",
    en: "The rooms",
    body: "Upstairs from the cafe. Hot water, a fan or air conditioning depending on the room, and breakfast downstairs when you come down.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-qaxwo text-caano">
        <div className="woven absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-qaxwo via-qaxwo/95 to-bun/35"
          aria-hidden
        />
        <Container className="relative">
          <div className="max-w-2xl py-24 sm:py-32">
            <p className="eyebrow text-guduud">Ku saabsan</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98]">
              Kuwa aan nahay
            </h1>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ciid/70">
              Who we are
            </p>
            <XawaashRule className="mt-5 max-w-xs text-guduud" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ciid/85">
              A coffee house on {SITE.address.street} that also feeds people and
              keeps rooms upstairs. That is the whole of it.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden border border-line">
              <Image
                src="/logo.jpeg"
                alt="KCC in Golol"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>

            <div>
              <SectionHeading
                eyebrow="Hal meel"
                so="Saddex shay, hal albaab"
                en="Three things, one door"
              />
              <div className="mt-7 flex flex-col gap-5 text-base leading-relaxed">
                <p className="text-ink">
                  Qaxwo ayaa horeysay. Ka dib jikada. Ka dib qolalka kor.
                  Dadka halkan yimaada waxay u yimaadaan mid ka mid ah — badanaa
                  waxay ku dhammaadaan saddexda.
                </p>
                <p className="text-ink-muted">
                  Coffee came first. Then the kitchen, because people who sat
                  long enough got hungry. Then the rooms upstairs, because some
                  of them had come a long way and did not fancy the drive back.
                </p>
                <p className="text-ink-muted">
                  We are open {SITE.hours.en}, every day. You do not need to book
                  for a coffee. You probably should for a table on a busy
                  evening, and definitely for a room.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/menu" variant="secondary">
                  Read the menu
                </ButtonLink>
                <ButtonLink href="/hotel">Book a room</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            eyebrow="Habka"
            so="Sida ay u shaqeyso"
            en="How it works"
            align="center"
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <article
                key={step.so}
                className="flex flex-col gap-4 bg-surface p-7"
              >
                <step.icon
                  className="h-6 w-6 text-accent"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-2xl text-ink">{step.so}</h3>
                  <p className="translation mt-1">{step.en}</p>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Visit */}
      <Section tone="deep">
        <Container size="narrow" className="text-center">
          <Coffee
            className="mx-auto h-7 w-7 text-guduud"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
            Soo gal, qaxwo cab
          </h2>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-caano/60">
            Come in, have a coffee
          </p>
          <XawaashRule width="short" className="mx-auto mt-4 text-guduud" />
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-caano/85">
            {SITE.address.full}. Open {SITE.hours.en}, {SITE.hours.daysEn}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contactus">Book a table</ButtonLink>
            <ButtonLink
              href={SITE.address.mapsUrl}
              variant="inverse"
              target="_blank"
            >
              Find us on the map
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
