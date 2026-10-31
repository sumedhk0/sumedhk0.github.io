import { FAMILIES } from "./theme";
import { ElementRecord, Family, PlacedElement } from "./types";

/** Column order: each field is one group, like a column of the real table. */
export const GROUP_ORDER = Object.keys(FAMILIES) as Family[];

/**
 * Place each element in its field's column, newest at the top. As in the real
 * table, the outer groups (1 and 18) start in period 1 and the rest in period 2.
 * Atomic numbers then run in reading order: left to right, top to bottom.
 */
export function placeElements(records: ElementRecord[]): PlacedElement[] {
  const cells = GROUP_ORDER.flatMap((family, g) => {
    const firstRow = g === 0 || g === GROUP_ORDER.length - 1 ? 1 : 2;
    return records
      .filter((r) => r.family === family)
      .sort((a, b) => b.start.localeCompare(a.start) || a.name.localeCompare(b.name))
      .map((r, i) => ({ r, col: g + 1, row: firstRow + i }));
  });
  return cells
    .sort((a, b) => a.row - b.row || a.col - b.col)
    .map(({ r, col, row }, i) => ({
      ...r,
      number: i + 1,
      year: Number(r.start.slice(0, 4)),
      col,
      row,
      href: r.kind === "card" ? null : `/work/${r.slug}/`,
    }));
}

export type ArrowKey = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

/** Number of the nearest cell in the arrow's direction, or `from` if there is none. */
export function neighbor(els: PlacedElement[], from: number, key: ArrowKey): number {
  const cur = els.find((e) => e.number === from);
  if (!cur) return from;
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  const sign = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
  const candidates = els.filter((e) =>
    horizontal
      ? e.row === cur.row && Math.sign(e.col - cur.col) === sign
      : e.col === cur.col && Math.sign(e.row - cur.row) === sign,
  );
  if (candidates.length === 0) return from;
  const dist = (e: PlacedElement) => Math.abs(horizontal ? e.col - cur.col : e.row - cur.row);
  return candidates.reduce((best, e) => (dist(e) < dist(best) ? e : best)).number;
}
