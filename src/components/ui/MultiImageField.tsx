"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { ErrorNote } from "./Feedback";
import { cn } from "@/lib/cn";

/**
 * Gallery editor for rooms: add pictures by URL, remove them, and reorder.
 *
 * No file upload — Cloud Storage is not enabled on this project. The first
 * image is the cover used on cards and the room hero, so ordering is a real
 * editorial decision rather than decoration, hence the arrows.
 */
export function MultiImageField({
  label,
  values,
  onChange,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function add() {
    const url = draft.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError("Image links need to start with http:// or https://");
      return;
    }
    setError("");
    onChange([...values, url]);
    setDraft("");
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-subtle">
          {values.length} {values.length === 1 ? "image" : "images"}
        </span>
      </div>
      {hint && <p className="-mt-1.5 text-xs text-ink-subtle">{hint}</p>}

      {values.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {values.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className={cn(
                "group relative overflow-hidden rounded-[3px] border bg-surface-sunken",
                i === 0 ? "border-accent-solid" : "border-line"
              )}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-[2px] bg-accent-solid px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-accent-ink">
                  Cover
                </span>
              )}

              <div className="flex items-center justify-between border-t border-line bg-surface-raised px-1 py-1">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move image ${i + 1} earlier`}
                    className="p-1.5 text-ink-subtle hover:text-ink disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === values.length - 1}
                    aria-label={`Move image ${i + 1} later`}
                    className="p-1.5 text-ink-subtle hover:text-ink disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(values.filter((_, x) => x !== i))}
                  aria-label={`Remove image ${i + 1}`}
                  className="p-1.5 text-ink-subtle hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 border border-dashed border-line px-4 py-8 text-center">
          <ImagePlus className="h-5 w-5 text-ink-subtle" />
          <p className="text-sm text-ink-muted">Sawir ma jiro · No images yet</p>
          <p className="text-xs text-ink-subtle">
            Guests see a woven placeholder until you add one.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Ku dhaji link sawir · Paste an image link"
          aria-label="Image URL"
          className="h-10 min-w-0 flex-1 rounded-[2px] border border-line bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-subtle"
        />
        <Button type="button" variant="secondary" size="sm" onClick={add}>
          Ku dar · Add
        </Button>
      </div>

      {error && <ErrorNote message={error} />}
    </div>
  );
}
