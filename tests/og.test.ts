import { describe, expect, test } from "vitest";
import { ELEMENTS } from "@/data/elements";
import { placeElements } from "@/lib/elements";
import { ogCell } from "@/lib/og-cell";

describe("OG image cell", () => {
  test("shows PolyFrameNet's live table number, not a hard-coded one", () => {
    const pf = placeElements(ELEMENTS).find((e) => e.slug === "pf")!;
    expect(ogCell().num).toBe(String(pf.number));
    expect(ogCell().sym).toBe("Pf");
  });
});
