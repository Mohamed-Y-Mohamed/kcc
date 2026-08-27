"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authErrorMessage, useAuth } from "@/context/AuthContext";
import { AuthCard } from "@/components/site/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const { signIn, resetPassword, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const next = params.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? Don't make them look at a login form.
  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      await signIn(email, password);
      router.replace(next);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email.trim()) {
      setError("Type your email address first, then tap reset.");
      return;
    }
    try {
      await resetPassword(email);
      toast(`Password reset sent to ${email.trim()}.`, "success");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }

  return (
    <AuthCard
      so="Soo gal"
      en="Sign in"
      lead="Sign in to see your bookings and book a room faster next time."
      footer={
        <>
          Haven&apos;t got an account?{" "}
          <Link
            href="/signup"
            className="text-accent underline underline-offset-4"
          >
            Create one
          </Link>
          .
          <span className="mt-3 block text-xs text-ink-subtle">
            Staff sign in at{" "}
            <Link
              href="/admin/login"
              className="underline underline-offset-4 hover:text-ink"
            >
              /admin
            </Link>
            .
          </span>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {error && <ErrorNote message={error} />}

        <Input
          label="Email"
          labelSo="Iimayl"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          labelSo="Furaha sirta"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" size="lg" loading={busy}>
          Sign in
        </Button>

        <button
          type="button"
          onClick={onReset}
          className="self-start text-xs text-ink-subtle underline underline-offset-4 hover:text-ink"
        >
          Forgotten your password?
        </button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary to prerender.
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <LoginForm />
    </Suspense>
  );
}
