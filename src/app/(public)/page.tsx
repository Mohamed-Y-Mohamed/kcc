"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  Clock,
  Coffee,
  MapPin,
  Phone,
  Play,
  UtensilsCrossed,
} from "lucide-react";
import { itemNames, listMenuItems } from "@/lib/menu";
import { listActiveRooms } from "@/lib/rooms";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { MenuItem, Room } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { Skeleton } from "@/components/ui/Feedback";

const OFFERS = [
  {
    icon: Coffee,
    so: "Qaxwo",
    en: "Coffee",
    body: "Bun la shiilay guriga, hayl iyo qorfe lagu daray. Shaah cadays sidoo kale.",
    bodyEn: "Beans roasted in-house with cardamom and cinnamon. Spiced tea too.",
    href: "/menu",
    cta: "See the drinks",
  },
  {
    icon: UtensilsCrossed,
    so: "Cunto",
    en: "Kitchen",
    body: "Bariis iskukaris, hilib ari dubban, sambuus cusub subax kasta.",
    bodyEn: "Spiced rice, grilled goat, samosas made fresh each morning.",
    href: "/menu",
    cta: "See the menu",
  },
  {
    icon: BedDouble,
    so: "Hoteel",
    en: "Rooms",
    body: "Qolal nadiif ah oo dusha sare, biyo kulul iyo wifi. Hal guri.",
    bodyEn: "Clean rooms upstairs with hot water and Wi-Fi. Same building.",
    href: "/hotel",
    cta: "Book a room",
  },
];

export default function LandingPage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    listMenuItems()
      .then(setItems)
      .catch(() => setItems([]));
    listActiveRooms()
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  // The board shows what the kitchen is proudest of, falling back to whatever
  // exists so it never renders an empty frame.
  const board = (items ?? [])
    .filter((i) => i.isActive)
    .sort(
      (a, b) =>
        Number(b.signature) - Number(a.signature) ||
        Number(b.popular) - Number(a.popular)
    )
    .slice(0, 5);

  return (
    <>
      <Hero board={board} loading={items === null} />

      {/* The three things this place is */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Saddexda shay"
            so="Hal guri, saddex shay"
            en="One building, three things"
            lead="KCC is a coffee house first. Then a kitchen. Then, upstairs, somewhere to sleep."
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {OFFERS.map((o) => (
              <Link
                key={o.so}
                href={o.href}
                className="group flex flex-col gap-4 bg-surface p-7 transition-colors duration-200 hover:bg-surface-sunken"
              >
                <o.icon
                  className="h-6 w-6 text-accent"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-2xl text-ink">{o.so}</h3>
                  <p className="translation mt-1">{o.en}</p>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {o.body}
                </p>
                <p className="text-sm leading-relaxed text-ink-subtle">
                  {o.bodyEn}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent">
                  {o.cta}
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Rooms */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            eyebrow="Hoteelka"
            so="Qol lagu seexdo"
            en="A room for the night"
            lead="Book online in under a minute. No account needed — though signing in keeps all your bookings in one place."
          />

          <div className="mt-12">
            {rooms === null ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-72 w-full" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="border border-dashed border-line px-6 py-14 text-center">
                <p className="font-display text-xl text-ink">
                  Qolalka waa la soo gelinayaa
                </p>
                <p className="translation mt-1.5">Rooms are being added</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-ink-muted">
                  Call {SITE.phone.display} in the meantime and we&apos;ll sort
                  you a room.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.slice(0, 3).map((room) => (
                  <Link
                    key={room.id}
                    href={`/hotel/${room.id}`}
                    className="group flex flex-col border border-line bg-surface transition-colors duration-200 hover:border-accent-solid"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
                      {room.images[0] ? (
                        <Image
                          src={room.images[0]}
                          alt={room.nameEn}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="woven h-full w-full" aria-hidden />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="font-display text-xl text-ink">
                        {room.nameSo}
                      </h3>
                      <p className="translation">{room.nameEn}</p>
                      <p className="mt-auto flex items-baseline gap-1.5 pt-3">
                        <span className="tnum text-lg text-accent">
                          {formatPrice(room.pricePerNight)}
                        </span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
                          per night
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {rooms !== null && rooms.length > 0 && (
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/hotel" variant="secondary" size="lg">
                See all rooms
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          )}
        </Container>
      </Section>

      <VideoPanel />
      <VisitPanel />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Hero({ board, loading }: { board: MenuItem[]; loading: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-qaxwo text-caano">
      <div className="woven absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-br from-qaxwo via-qaxwo/95 to-bun/40"
        aria-hidden
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 py-32 sm:py-40 lg:grid-cols-12 lg:gap-12 lg:py-44">
          {/* Statement */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="rise font-mono text-[0.7rem] uppercase tracking-[0.28em] text-guduud">
              {SITE.address.street} · {SITE.address.city} · {SITE.address.country}
            </p>

            <h1 className="rise rise-1 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-caano">
              Qaxwo, cunto,
              <br />
              iyo qol.
            </h1>

            <p className="rise rise-2 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.24em] text-ciid/70">
              Coffee. A kitchen. A room for the night.
            </p>

            <XawaashRule className="rise rise-2 max-w-xs text-guduud" />

            <p className="rise rise-3 max-w-md text-base leading-relaxed text-ciid/85">
              We roast the beans here, cook the rice here, and keep rooms upstairs
              for anyone who&apos;d rather not drive home. Been on Argo Street a
              long time.
            </p>

            <div className="rise rise-3 flex flex-wrap gap-3 pt-1">
              <ButtonLink href="/hotel" size="lg">
                Book a room
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/menu"
                size="lg"
                variant="inverse"
              >
                Read the menu
              </ButtonLink>
            </div>

            <dl className="rise rise-4 mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-ciid/15 pt-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ciid/65">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-guduud" aria-hidden />
                <dt className="sr-only">Opening hours</dt>
                <dd>{SITE.hours.en}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-guduud" aria-hidden />
                <dt className="sr-only">Phone</dt>
                <dd className="tnum">{SITE.phone.display}</dd>
              </div>
            </dl>
          </div>

          {/* The board — what the kitchen is proudest of today */}
          <div className="rise rise-2 lg:col-span-5">
            <div className="border border-ciid/20 bg-qaxwo/60 backdrop-blur-sm">
              <div className="flex items-baseline justify-between border-b border-ciid/20 px-6 py-4">
                <h2 className="font-display text-xl text-caano">Maanta</h2>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ciid/55">
                  On the board
                </span>
              </div>

              <div className="px-6 py-2">
                {loading ? (
                  <ul className="flex flex-col gap-4 py-4">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} tone="inverse" className="h-9 w-full" />
                    ))}
                  </ul>
                ) : board.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ciid/60">
                    The board goes up once the kitchen adds today&apos;s dishes.
                  </p>
                ) : (
                  <ul className="divide-y divide-ciid/12">
                    {board.map((item) => {
                      const name = itemNames(item);
                      return (
                        <li key={item.id} className="py-3.5">
                          <div className="leader">
                            <span className="font-display text-base text-caano">
                              {name.lead}
                            </span>
                            <span
                              className="leader-fill !border-ciid/30"
                              aria-hidden
                            />
                            <span className="tnum shrink-0 text-sm text-guduud">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          {name.sub && (
                            <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ciid/45">
                              {name.sub}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <Link
                href="/menu"
                className="flex items-center justify-between border-t border-ciid/20 px-6 py-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-guduud transition-colors hover:bg-ciid/5"
              >
                Full menu
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The clip is nearly 6MB, so it never loads until someone asks for it. Most of
 * our customers are on mobile data.
 */
function VideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function start() {
    setPlaying(true);
    // Let React attach the controls before asking the element to play.
    requestAnimationFrame(() => videoRef.current?.play());
  }

  return (
    <Section tone="surface">
      <Container>
        <SectionHeading
          eyebrow="Booqasho"
          so="Eeg meesha"
          en="Look around"
          lead="A short clip of the place. It's about 6MB, so it only loads when you press play."
          align="center"
        />

        <div className="relative mt-12 overflow-hidden border border-line bg-qaxwo">
          <div className="aspect-video w-full">
            {playing ? (
              <video
                ref={videoRef}
                src="/intro.mp4"
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <button
                onClick={start}
                className="group relative flex h-full w-full items-center justify-center"
                aria-label="Play the KCC video"
              >
                <span className="woven absolute inset-0 opacity-70" aria-hidden />
                <Image
                  src="/logo.jpeg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover opacity-25"
                />
                <span className="relative flex flex-col items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-guduud/60 bg-qaxwo/70 transition-transform duration-300 group-hover:scale-110">
                    <Play
                      className="ml-1 h-6 w-6 text-guduud"
                      fill="currentColor"
                    />
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ciid/80">
                    Play · 5.9 MB
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function VisitPanel() {
  return (
    <Section tone="deep" className="text-deep-ink">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-guduud">
              Nagu soo booqo
            </p>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
              Halkan ayaan joognaa
            </h2>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-caano/60">
              This is where we are
            </p>
            <XawaashRule width="short" className="text-guduud" />

            <ul className="mt-2 flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-guduud" />
                <a
                  href={SITE.address.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {SITE.address.full}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-guduud" />
                <a
                  href={`tel:${SITE.phone.e164}`}
                  className="tnum underline-offset-4 hover:underline"
                >
                  {SITE.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-guduud" />
                <span>
                  {SITE.hours.en}
                  <span className="block text-caano/60">
                    {SITE.hours.daysSo} · {SITE.hours.daysEn}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-3 flex flex-wrap gap-3">
              <ButtonLink href="/contactus" size="md">
                Book a table
              </ButtonLink>
              <Button
                variant="inverse"
                size="md"
                onClick={() => window.open(SITE.address.mapsUrl, "_blank")}
              >
                Open in Maps
              </Button>
            </div>
          </div>

          <div className="overflow-hidden border border-caano/20">
            <iframe
              title="Map showing KCC on Argo Street, Golol"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                SITE.address.full
              )}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full grayscale-[0.3] contrast-[1.05]"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
