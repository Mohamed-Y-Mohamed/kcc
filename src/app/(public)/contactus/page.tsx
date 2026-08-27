"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { sendMessage } from "@/lib/messages";
import { useAuth } from "@/context/AuthContext";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { todayISO } from "@/lib/format";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";
import { useToast } from "@/components/ui/Toast";

const OCCASIONS = [
  { value: "Table for a meal", label: "Table for a meal" },
  { value: "Birthday", label: "Birthday" },
  { value: "Family gathering", label: "Family gathering" },
  { value: "Business meeting", label: "Business meeting" },
  { value: "Large group", label: "Large group" },
  { value: "Something else", label: "Something else" },
];

const TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

export default function ContactPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: "2",
    date: "",
    time: "19:00",
    occasion: OCCASIONS[0].value,
    message: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!user && !profile) return;
    setForm((f) => ({
      ...f,
      name: f.name || profile?.displayName || "",
      email: f.email || user?.email || "",
      phone: f.phone || profile?.phone || "",
    }));
  }, [user, profile]);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("We need a name to put the table under.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Add an email address so we can reply.");
      return;
    }
    if (form.phone.trim().length < 6) {
      setError("Add a phone number — it's the quickest way to reach you.");
      return;
    }

    setBusy(true);
    try {
      await sendMessage({
        name: form.name.trim(),
        email: form.email,
        phone: form.phone.trim(),
        partySize: Number(form.partySize) || 0,
        date: form.date,
        time: form.time,
        occasion: form.occasion,
        message: form.message.trim(),
      });
      setSent(true);
      toast("Message sent. We'll get back to you.", "success");
    } catch (err) {
      console.error(err);
      setError(
        `Couldn't send that. Call us on ${SITE.phone.display} and we'll sort it.`
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-qaxwo text-caano">
        <div className="woven absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-qaxwo via-qaxwo/95 to-bun/45"
          aria-hidden
        />
        <Container className="relative">
          <div className="max-w-2xl py-24 sm:py-32">
            <p className="eyebrow text-guduud">Xiriir</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98]">
              Nala soo xiriir
            </h1>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ciid/70">
              Get in touch
            </p>
            <XawaashRule className="mt-5 max-w-xs text-guduud" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ciid/85">
              Book a table, ask about a large group, or just tell us you&apos;re
              coming. Phone is fastest.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            {/* Form */}
            <div>
              {sent ? (
                <div className="border border-success/40 bg-success/5 p-8">
                  <CheckCircle2
                    className="h-9 w-9 text-success"
                    strokeWidth={1.5}
                  />
                  <h2 className="mt-5 font-display text-3xl text-ink">
                    Waa la helay
                  </h2>
                  <p className="translation mt-1.5">Message received</p>
                  <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-muted">
                    Thanks {form.name.split(" ")[0]}. We&apos;ll come back to you
                    on {form.phone} or {form.email}. If it&apos;s for today, give
                    us a ring instead — we&apos;ll see it faster.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href={`tel:${SITE.phone.e164}`}>
                      Call {SITE.phone.display}
                    </ButtonLink>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSent(false);
                        setForm((f) => ({ ...f, message: "" }));
                      }}
                    >
                      Send another
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <SectionHeading
                    eyebrow="Miis"
                    so="Miis noo qabso"
                    en="Reserve a table"
                    lead="Fill this in and we'll confirm by phone. It's not an instant booking — we check the room first."
                  />

                  <form
                    onSubmit={submit}
                    noValidate
                    className="mt-10 flex flex-col gap-5"
                  >
                    {error && <ErrorNote message={error} />}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Your name"
                        labelSo="Magacaaga"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoComplete="name"
                        required
                      />
                      <Input
                        label="Phone"
                        labelSo="Telefoon"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>

                    <Input
                      label="Email"
                      labelSo="Iimayl"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      required
                    />

                    <div className="grid gap-5 sm:grid-cols-3">
                      <Input
                        label="How many people"
                        labelSo="Immisa qof"
                        type="number"
                        min={1}
                        value={form.partySize}
                        onChange={(e) => set("partySize", e.target.value)}
                      />
                      <Input
                        label="Date"
                        labelSo="Taariikhda"
                        type="date"
                        min={todayISO()}
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                      />
                      <Select
                        label="Time"
                        labelSo="Saacadda"
                        value={form.time}
                        onChange={(e) => set("time", e.target.value)}
                        options={TIMES.map((t) => ({ value: t, label: t }))}
                      />
                    </div>

                    <Select
                      label="What's the occasion"
                      labelSo="Munaasabadda"
                      value={form.occasion}
                      onChange={(e) => set("occasion", e.target.value)}
                      options={OCCASIONS}
                    />

                    <Textarea
                      label="Anything else"
                      labelSo="Wax kale"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={4}
                      hint="Allergies, a high chair, a quiet corner — tell us here."
                    />

                    <Button type="submit" size="lg" loading={busy}>
                      Send the request
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Details */}
            <aside className="flex flex-col gap-6">
              <div className="border border-line bg-surface-raised p-6">
                <h2 className="font-display text-2xl text-ink">Faahfaahin</h2>
                <p className="translation mt-1">Details</p>

                <ul className="mt-5 flex flex-col gap-5 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="translation block">Where</span>
                      <a
                        href={SITE.address.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block text-ink underline-offset-4 hover:underline"
                      >
                        {SITE.address.full}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="translation block">Phone</span>
                      <a
                        href={`tel:${SITE.phone.e164}`}
                        className="tnum mt-0.5 block text-ink underline-offset-4 hover:underline"
                      >
                        {SITE.phone.display}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="translation block">Open</span>
                      <span className="mt-0.5 block text-ink">
                        {SITE.hours.en}
                      </span>
                      <span className="block text-xs text-ink-subtle">
                        {SITE.hours.daysSo} · {SITE.hours.daysEn}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="translation block">Email</span>
                      {/* Not a mailto: the address on file is malformed. */}
                      <span className="mt-0.5 block break-all text-ink">
                        {SITE.email.display}
                      </span>
                    </span>
                  </li>
                </ul>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] bg-accent-solid px-4 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
              </div>

              <div className="overflow-hidden border border-line">
                <iframe
                  title="Map showing KCC on Argo Street, Golol"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    SITE.address.full
                  )}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full"
                />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
