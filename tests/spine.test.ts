import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { snapToVertex, spineDraw, spinePath } from "@/lib/spine";

const vertices = (d: string) =>
  [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe("spinePath", () => {
  test("zig-zags between xL and xR on every step", () =>
    expect(vertices(spinePath(0, 88))).toEqual([
      [14, 0],
      [38, 22],
      [14, 44],
      [38, 66],
      [14, 88],
    ]));
  test("starts at the first step multiple at or after y0", () => expect(vertices(spinePath(10, 50))[0]).toEqual([38, 22]));
  test("a zero-length range is a single move", () => expect(spinePath(0, 0)).toBe("M14,0"));
  test("custom geometry for narrow screens", () =>
    expect(vertices(spinePath(0, 24, { step: 12, xL: 6, xR: 18 }))).toEqual([
      [6, 0],
      [18, 12],
      [6, 24],
    ]));
});

describe("snapToVertex", () => {
  test("snaps to the nearest vertex", () => expect(snapToVertex(30)).toEqual({ x: 38, y: 22 }));
  test("rounds up past the midpoint", () => expect(snapToVertex(34)).toEqual({ x: 14, y: 44 }));
});

describe("spineDraw", () => {
  const segs = [
    { top: 0, height: 100 },
    { top: 100, height: 100 },
  ];
  const sides = [{ y: 50 }, { y: 150 }];
  test("half-way down: first segment full, second empty", () =>
    expect(spineDraw(0.5, segs, sides)).toEqual({ offsets: [0, 1], opacities: [1, 0.15] }));
  test("three quarters: second segment half drawn", () =>
    expect(spineDraw(0.75, segs, sides)).toEqual({ offsets: [0, 0.5], opacities: [1, 1] }));
  test("progress is clamped to 0..1", () => {
    expect(spineDraw(-2, segs, sides).offsets).toEqual([1, 1]);
    expect(spineDraw(9, segs, sides).offsets).toEqual([0, 0]);
  });
});

describe("spine scroll handling", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "../components/spine/spine-svg.tsx"), "utf8");
  test("scroll never re-renders React; it paints at most once per frame", () => {
    expect(src).not.toContain("setProgress");
    expect(src).toContain("requestAnimationFrame");
  });
});

describe("spine CSS", () => {
  const css0 = fs.readFileSync(path.resolve(__dirname, "../components/spine/spine.css"), "utf8");
  test("the chain tracks scroll directly, without a lagging stroke transition", () =>
    expect(css0).not.toContain("transition: stroke-dashoffset"));
  const css = fs.readFileSync(path.resolve(__dirname, "../components/spine/spine.css"), "utf8");
  test("reduced motion draws the spine fully", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toContain(".spine-path");
    expect(block).toContain("stroke-dashoffset: 0");
  });
  test("a static no-JS fallback exists", () => expect(css).toContain(".spine-fallback"));
});
