"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { authErrorMessage, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/Feedback";
import { XawaashRule } from "@/components/ui/XawaashRule";

export default function AdminLoginPage() {
  const { signIn, user, isStaff, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Once the profile resolves as staff, go straight through.
  useEffect(() => {
    if (!loading && user && isStaff) router.replace("/admin");
  }, [loading, user, isStaff, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your staff email and password.");
      return;
    }

    setBusy(true);
    try {
      await signIn(email, password);
      // The layout takes it from here: admins land on the dashboard, anyone
      // else gets told how to get promoted.
      router.replace("/admin");
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-deep-solid px-5 py-16">
      <div className="woven absolute inset-0 opacity-30" aria-hidden />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-bone"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to the site
        </Link>

        <div className="border border-bone/15 bg-roasted/70 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-[3px] border border-xawaash/40">
              <Image src="/logo.jpeg" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl text-bone">KCC</span>
              <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-bone/50">
                Back of house
              </span>
            </span>
          </div>

          <h1 className="mt-7 font-display text-3xl leading-tight text-bone">
            Gelitaanka shaqaalaha
          </h1>
          <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-bone/55">
            Staff sign in
          </p>
          <XawaashRule width="short" className="mt-3 text-xawaash" />

          <form onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-5">
            {error && <ErrorNote message={error} />}

            <div className="[&_label_span]:text-bone [&_.translation]:text-bone/50">
              <Input
                label="Staff email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="[&_label_span]:text-bone [&_.translation]:text-bone/50">
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" loading={busy}>
              <ShieldCheck className="h-4 w-4" />
              Sign in to the dashboard
            </Button>
          </form>

          <p className="mt-6 border-t border-bone/10 pt-5 text-xs leading-relaxed text-bone/50">
            Staff accounts are ordinary accounts that have been given a
            back-of-house role. Sign up on the{" "}
            <Link href="/signup" className="underline underline-offset-4">
              customer form
            </Link>{" "}
            first, then ask the owner or a manager to give you a role.
          </p>
        </div>
      </div>
    </div>
  );
}
