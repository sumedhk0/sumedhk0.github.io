import { describe, expect, test } from "vitest";
import { linearScale, logScale, logTicks, niceTicks } from "@/lib/charts/scale";
import { parseCsv, readCsv } from "@/lib/data/read";

describe("scales", () => {
  test("linearScale maps the midpoint", () => expect(linearScale([0, 10], [0, 100])(5)).toBe(50));
  test("logScale is linear in decades", () => expect(logScale([1, 1000], [0, 300])(10)).toBeCloseTo(100));
  test("logScale rejects non-positive domains", () => expect(() => logScale([0, 10], [0, 1])).toThrow());
  test("niceTicks steps by 1 over 0..4", () => expect(niceTicks(0, 4)).toEqual([0, 1, 2, 3, 4]));
  test("niceTicks steps by 25 over 0..100", () => expect(niceTicks(0, 100)).toEqual([0, 25, 50, 75, 100]));
  test("logTicks lists powers of ten in range", () => expect(logTicks(20, 30000)).toEqual([100, 1000, 10000]));
});

describe("data loading", () => {
  test("parseCsv handles quoted fields with commas", () =>
    expect(parseCsv('a,b\n1,"x, y"\n')).toEqual([{ a: "1", b: "x, y" }]));

  test("PolyFrameNet speed CSV reproduces the 2.55x and 5.51x speedups over MACE", () => {
    const rows = readCsv("polyframenet/l40s_speed_memory.csv");
    const ms = (model: string, n: string) =>
      Number(rows.find((r) => r.model === model && r.n_atoms === n)!.ms_per_step);
    expect((ms("MACE", "976") / ms("PolyFrameNet v2", "976")).toFixed(2)).toBe("2.55");
    expect((ms("MACE", "7808") / ms("PolyFrameNet v2", "7808")).toFixed(2)).toBe("5.51");
  });
});
