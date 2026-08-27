"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, Upload } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { Field } from "./Field";
import { Button } from "./Button";

/**
 * Single image: paste a URL or upload a file. Always optional — the menu reads
 * perfectly well without photos, and it falls back to the woven placeholder.
 */
export function ImageField({
  label,
  value,
  onChange,
  folder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [broken, setBroken] = useState(false);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      onChange(await uploadImage(file, folder));
      setBroken(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <Field label={label} hint={hint} error={error}>
        {({ id, describedBy }) => (
          <input
            id={id}
            type="url"
            inputMode="url"
            value={value}
            aria-describedby={describedBy}
            onChange={(e) => {
              onChange(e.target.value);
              setBroken(false);
            }}
            placeholder="https://…"
            className="w-full rounded-[2px] border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle"
          />
        )}
      </Field>

      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {!uploading && <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-ink-subtle underline underline-offset-2 hover:text-ink"
          >
            Remove
          </button>
        )}
      </div>

      {value && (
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-[3px] border border-line bg-surface-sunken">
          {broken ? (
            <span className="flex items-center gap-2 text-xs text-ink-subtle">
              <ImageOff className="h-4 w-4" /> That URL didn&apos;t load
            </span>
          ) : (
            <Image
              src={value}
              alt=""
              fill
              sizes="400px"
              className="object-cover"
              onError={() => setBroken(true)}
              unoptimized
            />
          )}
        </div>
      )}
    </div>
  );
}
