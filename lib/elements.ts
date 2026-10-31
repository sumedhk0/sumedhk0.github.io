import { ElementRecord, PlacedElement } from "./types";

/** Cell position for element n in the period 1–3 main-group shape (2 + 8 + 8). */
function cellFor(n: number): { col: number; row: number } {
  if (n === 1) return { col: 1, row: 1 };
  if (n === 2) return { col: 8, row: 1 };
  if (n <= 10) return { col: n - 2, row: 2 };
  return { col: n - 10, row: 3 };
}

/** Number elements by start date (oldest = 1, ties by name) and place them. */
export function placeElements(records: ElementRecord[]): PlacedElement[] {
  return [...records]
    .sort((a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name))
    .map((r, i) => ({
      ...r,
      number: i + 1,
      year: Number(r.start.slice(0, 4)),
      ...cellFor(i + 1),
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
