import type { Findings } from "./types";

// Temporary stand-ins so every findings route builds; Tasks 8 and 9 replace
// each one with real content and remove it from this list.
const stub = (slug: string, lead: string): Findings => ({ slug, dates: "2026", lead, figures: [], steps: [] });

export const PLACEHOLDERS: Findings[] = [
  {
    ...stub("pf", "PolyFrameNet runs 2.5–5.5× faster than MACE and scales to 26K-atom polymer melts."),
    figures: [{ kind: "chart", chartId: "pf-speed", caption: "Inference time per MD step versus system size on one L40S." }],
  },
  stub("pt", "PolyT5-RLVR: findings page in progress."),
  stub("ps", "ML-assisted PSO: findings page in progress."),
  stub("pp", "Panoptic Pigskin: findings page in progress."),
  stub("gs", "GameSense: findings page in progress."),
  stub("rb", "Robotech debris robot: findings page in progress."),
  stub("gt", "GT Transfer Equivalencies: findings page in progress."),
];
