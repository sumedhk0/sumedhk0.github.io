import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { activeSection } from "@/lib/sections";

const ids = ["work", "about", "projects", "education", "contact"];
const VH = 1000;

describe("activeSection", () => {
  test("at the page bottom the last section wins, even if it never reaches the reading line", () =>
    expect(activeSection(ids, [-4000, -3000, -900, -100, 600], VH, true)).toBe("contact"));
  test("otherwise the last section whose top has passed 30% of the viewport", () =>
    expect(activeSection(ids, [-4000, -3000, -900, 250, 900], VH, false)).toBe("education"));
  test("a section just below the reading line is not yet current", () =>
    expect(activeSection(ids, [-4000, -3000, -900, 350, 900], VH, false)).toBe("projects"));
  test("before any section reaches the line, the first one is current", () =>
    expect(activeSection(ids, [400, 1400, 2400, 3400, 4400], VH, false)).toBe("work"));
});

describe("drawing index", () => {
  const css = fs.readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");
  const src = fs.readFileSync(path.resolve(__dirname, "../components/home/drawing-index.tsx"), "utf8");
  test("index links have a hover style", () => expect(css).toContain(".drawing-index a:hover"));
  test("a clicked link stays current until the reader scrolls themselves", () => {
    expect(src).toContain("onClick");
    expect(src).toContain("wheel");
  });
});
