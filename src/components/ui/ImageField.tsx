"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Field } from "./Field";

/**
 * A single image, referenced by URL. Always optional.
 *
 * There is no file upload: Cloud Storage is not enabled on this project, so
 * pictures are linked from wherever they already live. The menu reads perfectly
 * well without any.
 */
export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <Field
        label={label}
        hint={hint ?? "Paste a link to a picture. Leave empty for none."}
      >
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

      {value && (
        <>
          <button
            type="button"
            onClick={() => onChange("")}
            className="self-start text-xs text-ink-subtle underline underline-offset-2 hover:text-ink"
          >
            Ka saar · Remove
          </button>

          <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-[3px] border border-line bg-surface-sunken">
            {broken ? (
              <span className="flex items-center gap-2 text-xs text-ink-subtle">
                <ImageOff className="h-4 w-4" /> That link didn&apos;t load
              </span>
            ) : (
              <Image
                src={value}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
                onError={() => setBroken(true)}
                // The URL can point anywhere, so skip Next's optimiser rather
                // than maintaining an allowlist of every possible host.
                unoptimized
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
