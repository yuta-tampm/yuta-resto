/**
 * Splits an integer cent amount into `parts` shares that always sum to `total`.
 * The remainder cents go to the first shares, one cent each.
 */
export function splitCents(total: number, parts: number): number[] {
  const base = Math.floor(total / parts);
  const remainder = total % parts;
  return Array.from(
    { length: parts },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}
