import { ELEMENTS } from "@/data/elements";
import { placeElements } from "@/lib/elements";
import { TableClient } from "./table-client";

/** The periodic table of work. Prerendered in full, so every cell and link exists without JS. */
export function PeriodicTable() {
  return <TableClient elements={placeElements(ELEMENTS)} initial="pf" />;
}
