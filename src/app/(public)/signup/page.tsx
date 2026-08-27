"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authErrorMessage, useAuth } from "@/context/AuthContext";
import { AuthCard } from "@/components/site/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  // Only show a field's error once it has been visited, so the form doesn't
  // shout at someone who is still filling in the first box.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/account");
  }, [authLoading, user, router]);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const errors = {
    displayName: form.displayName.trim() ? "" : "We need a name for the booking.",
    email: /^\S+@\S+\.\S+$/.test(form.email.trim())
      ? ""
      : "That email address doesn't look right.",
    password:
      form.password.length >= 6 ? "" : "Use at least 6 characters.",
    confirm:
      form.confirm === form.password ? "" : "The two passwords don't match.",
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setTouched({
      displayName: true,
      email: true,
      password: true,
      confirm: true,
    });

    const firstProblem = Object.values(errors).find(Boolean);
    if (firstProblem) {
      setError(firstProblem);
      return;
    }

    setBusy(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        displayName: form.displayName.trim(),
        phone: form.phone.trim(),
      });
      toast("Account created. Welcome to KCC.", "success");
      router.replace("/account");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      so="Samee akoon"
      en="Create an account"
      lead="An account keeps your bookings together. You can also book a room without one."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent underline underline-offset-4">
            Sign in
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {error && <ErrorNote message={error} />}

        <Input
          label="Full name"
          labelSo="Magaca"
          autoComplete="name"
          value={form.displayName}
          onChange={(e) => set("displayName", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, displayName: true }))}
          error={touched.displayName ? errors.displayName : ""}
          required
        />

        <Input
          label="Email"
          labelSo="Iimayl"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={touched.email ? errors.email : ""}
          required
        />

        <Input
          label="Phone"
          labelSo="Telefoon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+252 …"
          hint="Optional. Helps us reach you about a booking."
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />

        <Input
          label="Password"
          labelSo="Furaha sirta"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={touched.password ? errors.password : ""}
          hint="At least 6 characters."
          required
        />

        <Input
          label="Confirm password"
          labelSo="Ku celi furaha"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          error={touched.confirm ? errors.confirm : ""}
          required
        />

        <Button type="submit" size="lg" loading={busy}>
          Create my account
        </Button>
      </form>
    </AuthCard>
  );
}
