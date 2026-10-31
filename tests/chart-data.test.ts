import { describe, expect, test } from "vitest";
import * as D from "@/lib/charts/data";

const row = (rows: { label: string; value: number }[], label: string) => rows.find((r) => r.label === label)!.value;
const pts = (s: { name: string; points: [number, number][] }[], name: string) => s.find((x) => x.name === name)!.points;

describe("PolyFrameNet charts", () => {
  test("pf-speed: 2.55x at 976 atoms and 5.51x at 7,808 over MACE; MACE and Allegro run out of memory", () => {
    const s = D.pfSpeed();
    const pfn = Object.fromEntries(pts(s, "PolyFrameNet"));
    const mace = Object.fromEntries(pts(s, "MACE"));
    expect((mace[976] / pfn[976]).toFixed(2)).toBe("2.55");
    expect((mace[7808] / pfn[7808]).toFixed(2)).toBe("5.51");
    expect(s.find((x) => x.name === "MACE")!.oomAfter).toBe(26352);
    expect(s.find((x) => x.name === "Allegro")!.oomAfter).toBe(7808);
  });
  test("pf-memory: 12.35 vs 3.62 GB at 7,808 atoms; PolyFrameNet reaches 26,352 atoms", () => {
    const s = D.pfMemory();
    expect(Object.fromEntries(pts(s, "MACE"))[7808]).toBe(12.35);
    expect(Object.fromEntries(pts(s, "PolyFrameNet"))[7808].toFixed(2)).toBe("3.62");
    expect(pts(s, "PolyFrameNet").map((p) => p[0])).toContain(26352);
  });
  test("pf-ablation: 115.6 -> 44.3 -> 34.4 meV/A test force error", () => {
    expect(D.pfAblation().map((r) => r.value.toFixed(1))).toEqual(["115.6", "44.3", "34.4"]);
  });
});

describe("PolyT5-RLVR charts", () => {
  test("pt-frontier: supervised replay slope 0.973 vs baseline 0.904", () => {
    const r = D.ptFrontier();
    expect(row(r, "Supervised replay")).toBe(0.973);
    expect(row(r, "Pretrained baseline")).toBe(0.904);
  });
  test("pt-ablation: regression head 27.11 K vs control 28.60 K, threshold 27.9142", () => {
    const { rows, threshold } = D.ptAblation();
    expect(row(rows, "Regression head")).toBe(27.11);
    expect(row(rows, "Control (text decode)")).toBe(28.6);
    expect(threshold).toBe(27.9142);
  });
  test("pt-scaling: RMSE 62.39 from scratch to 44.45 at 92.3M polymers", () => {
    const r = D.ptScaling();
    expect(r[0].value).toBe(62.39);
    expect(row(r, "92.3M polyOne")).toBe(44.45);
  });
});

describe("ML-assisted PSO charts", () => {
  test("ps-objective: best +ML relative to vanilla PSO (Ackley 2.891 -> 0.278, Rastrigin 201.5 -> 93.443); Griewank shown", () => {
    const r = D.psObjective();
    expect(row(r, "Ackley")).toBeCloseTo((0.278 / 2.891) * 100, 5);
    expect(row(r, "Rastrigin")).toBeCloseTo((93.443 / 201.5) * 100, 5);
    expect(r.map((x) => x.label)).toContain("Griewank");
  });
  test("ps-ml-gain: GP-guided variants improve 38.3-95.6% with the learned layer", () => {
    const { rows, min, max } = D.psMlGain();
    expect(min).toBe(38.3);
    expect(max).toBe(95.6);
    expect(row(rows, "Sphere")).toBe(95.6);
  });
});
