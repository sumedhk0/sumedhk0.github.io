// Chart ids live here (not in the chart registry) so content and tests can
// name charts without importing React components or build-time fs code.
export const CHART_IDS = [
  "pf-speed",
  "pf-memory",
  "pf-ablation",
  "pt-frontier",
  "pt-ablation",
  "pt-scaling",
  "ps-objective",
  "ps-ml-gain",
  "pp-calibration",
  "pp-surges",
  "pp-pck",
] as const;
export type ChartId = (typeof CHART_IDS)[number];

export type Figure =
  | { kind: "chart"; chartId: ChartId; caption: string }
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption: string }
  | { kind: "video"; src: string; poster: string; width: number; height: number; caption: string };

export interface Findings {
  slug: string;
  dates: string;
  affiliation?: string;
  lead: string;
  figures: Figure[];
  steps: string[];
  limits?: string;
  stats?: { value: string; label: string }[];
}
