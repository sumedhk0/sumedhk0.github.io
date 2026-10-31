// Chart inputs built from the committed research data (content/data/).
// Kept separate from the SVG components so tests can check every number a
// chart draws against the values the repos publish.
import { readCsv, readJson } from "@/lib/data/read";

export interface Row {
  label: string;
  value: number;
  highlight?: boolean;
  note?: string;
}
export interface LineSeries {
  name: string;
  points: [number, number][];
  highlight?: boolean;
  oomAfter?: number;
}

const n = Number;

// ---- PolyFrameNet ----
function pfSeries(metric: "ms_per_step" | "peak_gpu_GB"): LineSeries[] {
  const rows = readCsv("polyframenet/l40s_speed_memory.csv");
  const one = (model: string, name: string, highlight = false): LineSeries => {
    const mine = rows.filter((r) => r.model === model);
    const oom = mine.find((r) => r.status !== "ok");
    return {
      name,
      highlight,
      points: mine.filter((r) => r.status === "ok").map((r) => [n(r.n_atoms), n(r[metric])]),
      oomAfter: oom ? n(oom.n_atoms) : undefined,
    };
  };
  return [one("PolyFrameNet v2", "PolyFrameNet", true), one("MACE", "MACE"), one("Allegro (eager)", "Allegro")];
}
export const pfSpeed = () => pfSeries("ms_per_step");
export const pfMemory = () => pfSeries("peak_gpu_GB");

export function pfAblation(): Row[] {
  const runs = readJson<{ run: string; test: { f_mae_meV_A: number } }[]>("polyframenet/ablation_8min.json");
  const f = (id: string) => runs.find((r) => r.run === id)!.test.f_mae_meV_A;
  return [
    { label: "Pairs > 2 block hops", value: f("try_b") },
    { label: "All but own block", value: f("try_d") },
    { label: "All pairs", value: f("try_c"), highlight: true },
  ];
}

// ---- PolyT5-RLVR ----
export function ptFrontier(): Row[] {
  const rows = readCsv("polyt5-rlvr/conditioning_frontier_rounds.csv");
  const label: Record<string, string> = {
    "baseline (supervised)": "Pretrained baseline",
    "composite (kl 0.02)": "GRPO, chemistry reward",
    "composite_kl05 (kl 0.05)": "GRPO + stronger KL",
    "composite_replay05 (replay 0.5)": "Supervised replay",
  };
  return rows.map((r) => ({
    label: label[r.model],
    value: n(r.slope),
    highlight: r.model.startsWith("composite_replay"),
    note: `${r.slope} · ${Math.round(n(r.pv) * 1000) / 10}% valid`,
  }));
}

export function ptAblation(): { rows: Row[]; threshold: number } {
  const rows = readCsv("polyt5-rlvr/group_a_tg_ablation.csv");
  const label: Record<string, string> = {
    B0: "Control (text decode)",
    A1: "Regression head",
    A2: "Descriptor auxiliaries",
    A3: "Invariance augmentation",
    A4: "Reliability weighting",
    A5: "Multi-task encoder",
    A6: "All five combined",
  };
  return {
    rows: rows.map((r) => ({ label: label[r.arm], value: n(r.mae_mean_K), highlight: r.arm === "A1" })),
    threshold: 27.9142,
  };
}

export function ptScaling(): Row[] {
  const rows = readCsv("polyt5-rlvr/pretraining_scaling_tg.csv").filter((r) => r.arm !== "paper reports");
  return rows.map((r) => ({
    label: r.pretraining_corpus === "none" ? "No pretraining" : `${r.corpus_size_M}M ${r.pretraining_corpus}`,
    value: n(r.rmse_K),
    highlight: r.corpus_size_M === "92.3",
  }));
}

// ---- ML-assisted PSO ----
export function psObjective(): Row[] {
  const rows = readCsv("ml-pso/dim50_median_final_objective.csv");
  const fns = ["ackley", "rastrigin", "rosenbrock", "griewank"];
  return fns.map((fn) => {
    const mine = rows.filter((r) => r.function === fn);
    const pso = n(mine.find((r) => r.variant === "PSO")!.median_final_value);
    const bestMl = Math.min(...mine.filter((r) => r.ml_repositioning === "yes").map((r) => n(r.median_final_value)));
    const rel = (bestMl / pso) * 100;
    return { label: fn[0].toUpperCase() + fn.slice(1), value: rel, highlight: rel < 100, note: `${Math.round(rel * 10) / 10}` };
  });
}

export function psMlGain(): { rows: Row[]; min: number; max: number } {
  const rows = readCsv("ml-pso/derived_ml_vs_base_improvement.csv").filter((r) => ["B", "C1", "C2"].includes(r.base_variant));
  const pct = rows.map((r) => n(r.pct_reduction));
  const fns = [...new Set(rows.map((r) => r.function))];
  return {
    rows: fns.map((fn) => ({
      label: fn[0].toUpperCase() + fn.slice(1),
      value: Math.max(...rows.filter((r) => r.function === fn).map((r) => n(r.pct_reduction))),
      highlight: true,
    })),
    min: Math.min(...pct),
    max: Math.max(...pct),
  };
}

// ---- Panoptic Pigskin ----
export function ppCalibration(): Row[] {
  const rows = readCsv("panoptic-pigskin/calibration_vs_tracking.csv");
  const pick = (prefix: string) => n(rows.find((r) => r.method.startsWith(prefix))!.xy_error_m_median);
  return [
    { label: "Per-frame calibration", value: pick("per-frame") },
    { label: "Shared camera, held-out players", value: pick("fixed-centre shared camera (held-out"), highlight: true },
  ];
}

export function ppSurges(): Row[] {
  const rows = readCsv("panoptic-pigskin/surges_before_after.csv");
  const share = (prefix: string) => n(rows.find((r) => r.version.startsWith(prefix))!.surge_share_pct);
  return [
    { label: "9-frame smoothing", value: share("v115") },
    { label: "Depth-axis smoothing", value: share("v117a"), highlight: true },
  ];
}

export function ppPck(): Row[] {
  const rows = readCsv("panoptic-pigskin/pose_finetune_pck.csv").filter((r) => r.label_source === "fit_cross");
  return rows.flatMap((r) => {
    const cam = r.camera[0].toUpperCase() + r.camera.slice(1);
    return [
      { label: `${cam}, before`, value: n(r.pck10_pretrained_pct) },
      { label: `${cam}, self-trained`, value: n(r.pck10_ft2_pct), highlight: true },
    ];
  });
}
