import type { Findings } from "./types";
import { as, li } from "./witness";
import { PLACEHOLDERS } from "./placeholders";

const ALL: Findings[] = [...PLACEHOLDERS, as, li];
const BY_SLUG = new Map(ALL.map((f) => [f.slug, f]));

export function getFindings(slug: string): Findings | undefined {
  return BY_SLUG.get(slug);
}

export function findingsSlugs(): string[] {
  return ALL.map((f) => f.slug);
}

export type { Findings, Figure, ChartId } from "./types";
