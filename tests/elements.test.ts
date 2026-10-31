import { describe, expect, test } from "vitest";
import { ELEMENTS } from "@/data/elements";
import { GROUP_ORDER, neighbor, placeElements } from "@/lib/elements";

const placed = placeElements(ELEMENTS);
const bySlug = (s: string) => placed.find((e) => e.slug === s)!;

describe("element roster", () => {
  test("has 18 elements", () => expect(ELEMENTS).toHaveLength(18));
  test("symbols are unique, two characters, capitalised", () => {
    const syms = ELEMENTS.map((e) => e.symbol);
    expect(new Set(syms).size).toBe(18);
    for (const s of syms) expect(s).toMatch(/^[A-Z][a-z]$/);
  });
  test("every start date is YYYY-MM", () => {
    for (const e of ELEMENTS) expect(e.start, e.slug).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });
  test("one-liners are at most 70 characters", () => {
    for (const e of ELEMENTS) expect(e.oneLiner.length, e.slug).toBeLessThanOrEqual(70);
  });
});

describe("groups (columns = field)", () => {
  test("there are 8 groups, one per column, in GROUP_ORDER", () => {
    expect(GROUP_ORDER).toHaveLength(8);
    for (const e of placed) expect(e.col, e.slug).toBe(GROUP_ORDER.indexOf(e.family) + 1);
  });
  test("every group has at least 2 elements", () => {
    for (const g of GROUP_ORDER) expect(placed.filter((e) => e.family === g).length, g).toBeGreaterThanOrEqual(2);
  });
  test("vision and hardware are separate groups", () => {
    expect(bySlug("pp").family).toBe("vision");
    expect(bySlug("gs").family).toBe("hardware");
  });
  test("newest work sits at the top of each group", () => {
    for (const g of GROUP_ORDER) {
      const col = placed.filter((e) => e.family === g).sort((a, b) => a.row - b.row);
      for (let i = 1; i < col.length; i++) expect(col[i].start <= col[i - 1].start, col[i].slug).toBe(true);
    }
  });
});

describe("placeElements numbering (reading order, like a real table)", () => {
  test("numbers run 1..18", () =>
    expect([...placed].map((e) => e.number).sort((a, b) => a - b)).toEqual([...Array(18)].map((_, i) => i + 1)));
  test("numbers increase left to right, then top to bottom", () => {
    const byNum = [...placed].sort((a, b) => a.number - b.number);
    for (let i = 1; i < byNum.length; i++) {
      const [p, c] = [byNum[i - 1], byNum[i]];
      expect(c.row > p.row || (c.row === p.row && c.col > p.col), c.slug).toBe(true);
    }
  });
  test("year comes from the start date", () => expect(bySlug("mf").year).toBe(2024));
});

describe("placeElements positions (2/8/8 shape)", () => {
  const at = (n: number) => placed.find((e) => e.number === n)!;
  test("1 → (1,1)", () => expect([at(1).col, at(1).row]).toEqual([1, 1]));
  test("2 → (8,1)", () => expect([at(2).col, at(2).row]).toEqual([8, 1]));
  test("3 → (1,2)", () => expect([at(3).col, at(3).row]).toEqual([1, 2]));
  test("18 → (8,3)", () => expect([at(18).col, at(18).row]).toEqual([8, 3]));
  test("no two elements share a cell", () =>
    expect(new Set(placed.map((e) => `${e.col},${e.row}`)).size).toBe(18));
});

describe("page kinds and links", () => {
  test("full and restricted elements link to /work/<slug>/, cards link nowhere", () => {
    for (const e of placed) {
      if (e.kind === "card") expect(e.href, e.slug).toBeNull();
      else expect(e.href, e.slug).toBe(`/work/${e.slug}/`);
    }
  });
  test("Witness AI elements are never full pages", () => {
    expect(bySlug("as").kind).not.toBe("full");
    expect(bySlug("li").kind).not.toBe("full");
  });
  test("projects with real material get full pages", () => {
    for (const s of ["pf", "pt", "pp", "ps", "gs", "rb", "gt", "cc"]) expect(bySlug(s).kind, s).toBe("full");
  });
});

describe("neighbor (arrow-key navigation)", () => {
  test("ArrowRight from 1 goes to 2 (skips the row-1 gap)", () => expect(neighbor(placed, 1, "ArrowRight")).toBe(2));
  test("ArrowUp from 3 goes to 1", () => expect(neighbor(placed, 3, "ArrowUp")).toBe(1));
  test("ArrowRight from 18 stays at 18", () => expect(neighbor(placed, 18, "ArrowRight")).toBe(18));
  test("ArrowDown from 2 goes to 10 (col 8, row 2)", () => expect(neighbor(placed, 2, "ArrowDown")).toBe(10));
  test("ArrowLeft from 11 stays at 11 (row start)", () => expect(neighbor(placed, 11, "ArrowLeft")).toBe(11));
});
