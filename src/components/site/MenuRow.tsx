import React from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { categoryLabel, itemDescription, itemNames } from "@/lib/menu";
import type { MenuItem } from "@/lib/types";

/**
 * A row from a printed menu: dish on the left, leader dots running across, price
 * on the right in tabular mono. The dots are the structural device — they say
 * "this is a priced list" without a border or a card in sight.
 */
export function MenuRow({
  item,
  showCategory = false,
}: {
  item: MenuItem;
  showCategory?: boolean;
}) {
  const name = itemNames(item);
  const description = itemDescription(item);
  const category = categoryLabel(item.category);

  return (
    <li className={cn("group py-3.5", !item.isActive && "opacity-55")}>
      <div className="leader">
        <span className="font-display text-lg leading-tight text-ink">
          {name.lead}
        </span>
        <span className="leader-fill" aria-hidden />
        <span className="tnum shrink-0 text-base text-accent">
          {formatPrice(item.price)}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {name.sub && <span className="translation">{name.sub}</span>}
        {showCategory && item.category && (
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
            {category.en}
          </span>
        )}
        {item.signature && (
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">
            · Signature
          </span>
        )}
        {item.popular && !item.signature && (
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-subtle">
            · Popular
          </span>
        )}
        {!item.isActive && (
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-danger">
            · Sold out
          </span>
        )}
      </div>

      {description.lead && (
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-muted">
          {description.lead}
        </p>
      )}
      {description.sub && (
        <p className="mt-0.5 max-w-prose text-sm leading-relaxed text-ink-subtle">
          {description.sub}
        </p>
      )}
    </li>
  );
}
