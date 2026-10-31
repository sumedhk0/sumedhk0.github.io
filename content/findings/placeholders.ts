import type { Findings } from "./types";

// Temporary stand-ins so every findings route builds; Task 9 replaces each
// one with real content and removes it from this list.
const stub = (slug: string, lead: string): Findings => ({ slug, dates: "2026", lead, figures: [], steps: [] });

export const PLACEHOLDERS: Findings[] = [
  stub("pp", "Panoptic Pigskin: findings page in progress."),
  stub("gs", "GameSense: findings page in progress."),
  stub("rb", "Robotech debris robot: findings page in progress."),
  stub("gt", "GT Transfer Equivalencies: findings page in progress."),
];
