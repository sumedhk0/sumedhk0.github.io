import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { contrast, FAMILIES, PALETTE } from "@/lib/theme";

const css = fs.readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8").toLowerCase();

describe("contrast()", () => {
  test("black on white is 21:1", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });
  test("identical colours are 1:1", () => {
    expect(contrast("#ffffff", "#ffffff")).toBe(1);
  });
});

for (const theme of ["light", "dark"] as const) {
  const p = PALETTE[theme];
  describe(`${theme} palette meets WCAG AA`, () => {
    test("ink on paper is at least 7:1", () => expect(contrast(p.ink, p.paper)).toBeGreaterThanOrEqual(7));
    test("muted on paper is at least 4.5:1", () => expect(contrast(p.muted, p.paper)).toBeGreaterThanOrEqual(4.5));
    test("blueprint on paper is at least 4.5:1", () => expect(contrast(p.blueprint, p.paper)).toBeGreaterThanOrEqual(4.5));
    test("pencil on paper is at least 4.5:1", () => expect(contrast(p.pencil, p.paper)).toBeGreaterThanOrEqual(4.5));
  });

  describe(`${theme} family colours`, () => {
    for (const [name, fam] of Object.entries(FAMILIES)) {
      const c = fam[theme];
      test(`${name}: white text on hover fill is at least 4.5:1`, () =>
        expect(contrast("#ffffff", c)).toBeGreaterThanOrEqual(4.5));
      test(`${name}: 4px bar against paper is at least 3:1`, () =>
        expect(contrast(c, p.paper)).toBeGreaterThanOrEqual(3));
    }
  });
}

test("globals.css carries every palette and family hex, so CSS and TS cannot drift", () => {
  const hexes = [
    ...Object.values(PALETTE.light),
    ...Object.values(PALETTE.dark),
    ...Object.values(FAMILIES).flatMap((f) => [f.light, f.dark]),
  ];
  for (const h of hexes) expect(css, `missing ${h}`).toContain(h.toLowerCase());
});
