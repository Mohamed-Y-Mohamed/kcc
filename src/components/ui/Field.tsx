"use client";

import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-[2px] border bg-surface-raised px-3 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-subtle transition-colors duration-150 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const NORMAL = "border-line hover:border-line-strong";
const INVALID = "border-danger";

interface WrapProps {
  label: string;
  /** Second language for the label — the site's core typographic device. */
  labelSo?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => React.ReactNode;
  className?: string;
}

/** Owns label/hint/error wiring once so every control gets it right. */
export function Field({
  label,
  labelSo,
  hint,
  error,
  required,
  children,
  className,
}: WrapProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-ink">
          {labelSo ?? label}
          {required && (
            <span className="ml-1 text-accent" aria-hidden>
              *
            </span>
          )}
        </span>
        {labelSo && <span className="translation">{label}</span>}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {/* Error first: screen readers hear the problem before the hint. */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs text-danger"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  Omit<WrapProps, "children">;

export function Input({
  label,
  labelSo,
  hint,
  error,
  required,
  className,
  ...rest
}: InputProps) {
  return (
    <Field
      label={label}
      labelSo={labelSo}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          className={cn(CONTROL, invalid ? INVALID : NORMAL)}
          {...rest}
        />
      )}
    </Field>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  Omit<WrapProps, "children">;

export function Textarea({
  label,
  labelSo,
  hint,
  error,
  required,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <Field
      label={label}
      labelSo={labelSo}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          className={cn(CONTROL, "resize-y", invalid ? INVALID : NORMAL)}
          {...rest}
        />
      )}
    </Field>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  Omit<WrapProps, "children"> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function Select({
  label,
  labelSo,
  hint,
  error,
  required,
  className,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  return (
    <Field
      label={label}
      labelSo={labelSo}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          className={cn(CONTROL, "h-11 cursor-pointer", invalid ? INVALID : NORMAL)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent-solid)]"
      />
      <label htmlFor={id} className="cursor-pointer select-none text-sm text-ink">
        {label}
        {hint && <span className="block text-xs text-ink-subtle">{hint}</span>}
      </label>
    </div>
  );
}
