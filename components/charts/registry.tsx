import type { ChartId } from "@/content/findings/types";
import { readCsv } from "@/lib/data/read";
import { LineChart, type Series } from "./line-chart";

const num = (s: string) => Number(s);

function PfSpeed() {
  const rows = readCsv("polyframenet/l40s_speed_memory.csv");
  const series = (model: string, name: string, highlight = false): Series => {
    const mine = rows.filter((r) => r.model === model);
    const ok = mine.filter((r) => r.status === "ok");
    const oom = mine.find((r) => r.status !== "ok");
    return {
      name,
      highlight,
      points: ok.map((r) => [num(r.n_atoms), num(r.ms_per_step)]),
      oomAfter: oom ? num(oom.n_atoms) : undefined,
    };
  };
  return (
    <LineChart
      xLog
      yLog
      xLabel="atoms in the simulation"
      yLabel="ms per MD step"
      ariaLabel="Inference time versus system size: PolyFrameNet v2 is 2.55 times faster than MACE at 976 atoms and 5.51 times faster at 7,808 atoms, and runs at 26,352 atoms where MACE and Allegro run out of memory."
      series={[series("PolyFrameNet v2", "PolyFrameNet", true), series("MACE", "MACE"), series("Allegro (eager)", "Allegro")]}
    />
  );
}

export const CHARTS: Partial<Record<ChartId, () => React.JSX.Element>> = {
  "pf-speed": PfSpeed,
};
