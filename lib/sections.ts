/** Fraction of the viewport height where a section counts as "being read". */
export const READING_LINE = 0.3;

/**
 * The section the reader is on: the last one whose top has passed the reading line.
 * At the page bottom the last section wins, since a short final section can never
 * scroll up to the line.
 */
export function activeSection(ids: readonly string[], tops: number[], viewportH: number, atBottom: boolean): string {
  if (atBottom) return ids[ids.length - 1];
  let current = ids[0];
  ids.forEach((id, i) => {
    if (tops[i] <= viewportH * READING_LINE) current = id;
  });
  return current;
}
