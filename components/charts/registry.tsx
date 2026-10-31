import type { ChartId } from "@/content/findings/types";
import * as D from "@/lib/charts/data";
import { BarChart } from "./bar-chart";
import { LineChart } from "./line-chart";

const PfSpeed = () => (
  <LineChart
    xLog
    yLog
    xLabel="atoms in the simulation"
    yLabel="ms per MD step"
    ariaLabel="Inference time versus system size on one L40S: PolyFrameNet is 2.55 times faster than MACE at 976 atoms and 5.51 times faster at 7,808 atoms, and still runs at 26,352 atoms where MACE and Allegro run out of memory."
    series={D.pfSpeed()}
  />
);

const PfMemory = () => (
  <LineChart
    xLog
    yLog
    xLabel="atoms in the simulation"
    yLabel="peak GPU memory (GB)"
    ariaLabel="Peak GPU memory versus system size: at 7,808 atoms PolyFrameNet uses 3.62 GB against MACE's 12.35 GB; only PolyFrameNet fits 26,352 atoms on the 46 GB card."
    series={D.pfMemory()}
  />
);

const PfAblation = () => (
  <BarChart
    rows={D.pfAblation()}
    unit=" meV/Å"
    ariaLabel="Test force error after eight minutes of training: 115.6 meV per angstrom when the many-body layer sees only pairs more than two block hops apart, 44.3 when it sees all but the atom's own block, 34.4 with all pairs."
  />
);

const PtFrontier = () => (
  <BarChart
    rows={D.ptFrontier()}
    max={1}
    refLine={{ value: 1, label: "perfect conditioning" }}
    ariaLabel="Tg-conditioning slope: pretrained 0.904, GRPO with a chemistry reward 0.268, with a stronger KL anchor 0.295, with supervised replay 0.973."
  />
);

const PtAblation = () => {
  const { rows, threshold } = D.ptAblation();
  return (
    <BarChart
      rows={rows}
      unit=" K"
      refLine={{ value: threshold, label: "pre-registered bar 27.91 K" }}
      ariaLabel="Tg prediction error by ablation arm: the regression head reaches 27.11 K against the control's 28.60 K and is the only arm under the pre-registered 27.91 K threshold."
    />
  );
};

const PtScaling = () => (
  <BarChart
    rows={D.ptScaling()}
    unit=" K"
    ariaLabel="Tg prediction RMSE by pretraining corpus: 62.39 K with no pretraining, 49.48 with 0.89 million polymers, 45.85 with 9.2 million, 44.45 with 92.3 million."
  />
);

const PsObjective = () => (
  <BarChart
    rows={D.psObjective()}
    max={140}
    refLine={{ value: 100, label: "vanilla PSO" }}
    ariaLabel="Final error of the best ML-assisted variant as a percentage of vanilla PSO at 50 dimensions: Ackley 9.6, Rastrigin 46.4, Rosenbrock 76.4, Griewank 129.9."
  />
);

const PsMlGain = () => (
  <BarChart
    rows={D.psMlGain().rows}
    unit="%"
    max={100}
    ariaLabel="Reduction in final error from adding learned repositioning to the best GP-guided variant: Sphere 95.6, Rastrigin 52.1, Ackley 60.0, Griewank 69.9, Rosenbrock 93.0 percent."
  />
);


const PpCalibration = () => (
  <BarChart
    rows={D.ppCalibration()}
    unit=" m"
    log
    ariaLabel="Median player position error against official NFL tracking: 6.17 metres with independent per-frame calibration, 0.15 metres for held-out players with the shared-camera solve."
  />
);

const PpSurges = () => (
  <BarChart
    rows={D.ppSurges()}
    unit="%"
    max={20}
    ariaLabel="Share of body-frames with physically implausible acceleration: 17.3 percent with plain 9-frame smoothing, 5.5 percent after smoothing along each camera's depth axis."
  />
);

const PpPck = () => (
  <BarChart
    rows={D.ppPck()}
    unit="%"
    max={100}
    ariaLabel="Keypoints within 10 pixels on held-out cross-camera labels: endzone 0.7 percent before and 66.1 after self-training; sideline 50.7 before and 87.5 after."
  />
);

export const CHARTS: Partial<Record<ChartId, () => React.JSX.Element>> = {
  "pf-speed": PfSpeed,
  "pf-memory": PfMemory,
  "pf-ablation": PfAblation,
  "pt-frontier": PtFrontier,
  "pt-ablation": PtAblation,
  "pt-scaling": PtScaling,
  "ps-objective": PsObjective,
  "ps-ml-gain": PsMlGain,
  "pp-calibration": PpCalibration,
  "pp-surges": PpSurges,
  "pp-pck": PpPck,
};
