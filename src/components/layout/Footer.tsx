import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { Container } from "@/components/ui/Section";
import { XawaashRule } from "@/components/ui/XawaashRule";

const LINKS = [
  { href: "/menu", so: "Menu", en: "Menu" },
  { href: "/hotel", so: "Hoteel", en: "Hotel" },
  { href: "/aboutus", so: "Ku Saabsan", en: "About" },
  { href: "/contactus", so: "Xiriir", en: "Contact" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create an account" },
  { href: "/account", label: "My bookings" },
];

export default function Footer() {
  return (
    <footer className="bg-roasted text-bone">
      <XawaashRule className="text-xawaash/70" />

      <Container size="wide">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-[3px] border border-xawaash/40">
                <Image
                  src="/logo.jpeg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl">KCC</span>
                <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ciid/70">
                  Golol, Somalia
                </span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ciid/80">
              {SITE.taglineSo} — qaxwo dhaqameed, cunto Soomaali ah iyo qol lagu
              nasto, hal meel.
            </p>
            <p className="translation text-ciid/50">
              Somali coffee, Somali cooking, and a room for the night
            </p>
          </div>

          {/* Visit */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-xawaash">
              Nagu soo booqo · Visit
            </h3>
            <a
              href={SITE.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-sm text-ciid/85 transition-colors hover:text-bone"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-xawaash" />
              <span>
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.country}
              </span>
            </a>
            <a
              href={`tel:${SITE.phone.e164}`}
              className="flex items-start gap-2.5 text-sm text-ciid/85 transition-colors hover:text-bone"
            >
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-xawaash" />
              <span className="tnum">{SITE.phone.display}</span>
            </a>
            <div className="flex items-start gap-2.5 text-sm text-ciid/85">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-xawaash" />
              <span>
                {SITE.hours.en}
                <span className="block text-xs text-ciid/60">
                  {SITE.hours.daysSo} · {SITE.hours.daysEn}
                </span>
              </span>
            </div>
          </div>

          {/* Pages */}
          <nav className="flex flex-col gap-4" aria-label="Footer">
            <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-xawaash">
              Bogagga · Pages
            </h3>
            <ul className="flex flex-col gap-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-baseline justify-between gap-3 text-sm text-ciid/85 transition-colors hover:text-xawaash"
                  >
                    <span className="font-display">{l.so}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ciid/45">
                      {l.en}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account + social */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-xawaash">
              Akoonkaaga · Account
            </h3>
            <ul className="flex flex-col gap-2.5">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ciid/85 transition-colors hover:text-xawaash"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex flex-wrap gap-2">
              {SITE.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[2px] border border-ciid/25 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ciid/75 transition-colors hover:border-xawaash hover:text-xawaash"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-fit items-center rounded-[2px] bg-xawaash px-3.5 py-2 text-sm font-medium text-roasted transition-[filter] hover:brightness-110"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ciid/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ciid/50">
            © {new Date().getFullYear()} {SITE.fullName}
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ciid/40">
            {SITE.address.full}
          </p>
        </div>
      </Container>
    </footer>
  );
}
