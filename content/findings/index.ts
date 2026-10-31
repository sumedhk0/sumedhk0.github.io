import type { Findings } from "./types";
import { as, li } from "./witness";
import { pf, pt, ps } from "./materials";
import { pp, gs, rb, gt } from "./builds";

const ALL: Findings[] = [pf, pt, ps, pp, gs, rb, gt, as, li];
const BY_SLUG = new Map(ALL.map((f) => [f.slug, f]));

export function getFindings(slug: string): Findings | undefined {
  return BY_SLUG.get(slug);
}

export function findingsSlugs(): string[] {
  return ALL.map((f) => f.slug);
}

export type { Findings, Figure, ChartId } from "./types";
