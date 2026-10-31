import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ELEMENTS } from "@/data/elements";
import { findingsSlugs, getFindings } from "@/content/findings";

const PUBLIC = path.resolve(__dirname, "../public");
const WITNESS_ALLOWED = new Set(["10K", "60%", "1,000+", "3,000+", "8", "3"]);
const nonCard = ELEMENTS.filter((e) => e.kind !== "card").map((e) => e.slug);
const card = ELEMENTS.filter((e) => e.kind === "card").map((e) => e.slug);

describe("findings registry", () => {
  test("every full or restricted element has findings", () => {
    for (const s of nonCard) expect(getFindings(s), s).toBeDefined();
  });
  test("no card element has a findings page", () => {
    for (const s of card) expect(findingsSlugs()).not.toContain(s);
  });
});

describe("findings content", () => {
  for (const slug of findingsSlugs()) {
    const f = getFindings(slug)!;
    test(`${slug}: lead is non-empty`, () => expect(f.lead.trim().length).toBeGreaterThan(0));
    test(`${slug}: every caption is 1-280 characters`, () => {
      for (const fig of f.figures) {
        expect(fig.caption.trim().length).toBeGreaterThan(0);
        expect(fig.caption.length).toBeLessThanOrEqual(280);
      }
    });
    test(`${slug}: every image and video file exists`, () => {
      for (const fig of f.figures) {
        if (fig.kind === "image") expect(fs.existsSync(path.join(PUBLIC, fig.src)), fig.src).toBe(true);
        if (fig.kind === "video") {
          expect(fs.existsSync(path.join(PUBLIC, fig.src)), fig.src).toBe(true);
          expect(fs.existsSync(path.join(PUBLIC, fig.poster)), fig.poster).toBe(true);
        }
      }
    });
  }
});

describe("Witness AI pages show resume details only", () => {
  for (const slug of ["as", "li"]) {
    test(`${slug}: no images, video or charts`, () => expect(getFindings(slug)!.figures).toHaveLength(0));
    test(`${slug}: every stat is a resume number`, () => {
      const stats = getFindings(slug)!.stats ?? [];
      expect(stats.length).toBeGreaterThan(0);
      for (const s of stats) expect(WITNESS_ALLOWED.has(s.value), s.value).toBe(true);
    });
  }
});

describe("view transition CSS", () => {
  const css = fs.readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");
  test("cross-document view transitions are on", () => expect(css).toContain("@view-transition { navigation: auto; }"));
  test("reduced motion turns the transition off", () => {
    const block = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toContain("::view-transition-group(*)");
    expect(block).toContain("animation: none");
  });
});

describe("Task 9 pages", () => {
  test("GT Transfer stats are the audited counts", () => {
    const v = (getFindings("gt")!.stats ?? []).map((s) => s.value);
    expect(v).toEqual(["2,076", "104,073", "1,461"]);
  });
  test("Panoptic Pigskin calibration caption names the Helmet-Assignment play", () => {
    const fig = getFindings("pp")!.figures.find((f) => f.kind === "chart" && f.chartId === "pp-calibration")!;
    expect(fig.caption).toMatch(/Helmet Assignment/);
  });
  test("GameSense never claims Kalman filtering", () => {
    expect(JSON.stringify(getFindings("gs"))).not.toMatch(/Kalman/i);
  });
  test("Robotech's 95% is the team-reported detection-and-removal rate", () => {
    const s = JSON.stringify(getFindings("rb"));
    if (s.includes("95%")) expect(s).toMatch(/detection-and-removal rate/);
  });
  test("each findings page's media totals at most 8 MB", () => {
    for (const slug of findingsSlugs()) {
      const bytes = getFindings(slug)!
        .figures.flatMap((f) => (f.kind === "image" ? [f.src] : f.kind === "video" ? [f.src, f.poster] : []))
        .reduce((sum, src) => sum + fs.statSync(path.join(PUBLIC, src)).size, 0);
      expect(bytes, slug).toBeLessThanOrEqual(8 * 1024 * 1024);
    }
  });
});
