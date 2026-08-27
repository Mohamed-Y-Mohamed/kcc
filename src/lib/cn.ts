/** Joins class names, dropping falsy values. Keeps conditional classes readable
 *  without pulling in a dependency for six lines of work. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
