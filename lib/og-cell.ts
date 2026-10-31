import { ELEMENTS } from "@/data/elements";
import { placeElements } from "@/lib/elements";

/** The PolyFrameNet cell shown on the share image, numbered as the live table numbers it. */
export function ogCell() {
  const pf = placeElements(ELEMENTS).find((e) => e.slug === "pf")!;
  return { num: String(pf.number), year: String(pf.year), sym: pf.symbol, label: "ML FOR MATERIALS" };
}
