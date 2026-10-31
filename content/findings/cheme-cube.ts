import type { Findings } from "./types";

// Sources: the competition Engineering Design Package (round 2) for the build,
// sorbent and cost numbers; the resume for the Bayesian-optimization framework
// and the 75% bench result. No team or member names, floor plans or sorbent
// recipe: the package is unpublished until after the November 2026 competition.

export const cc: Findings = {
  slug: "cc",
  dates: "August 2025 – present · competing at AIChE, November 2026",
  affiliation: "AIChE ChemE Cube · software, mechanical & electrical lead",
  lead: "ChemE Cube asks student teams to fit a working chemical plant inside one cubic foot. Ours pulls carbon dioxide straight out of room air. In bench validation the finished prototype cut ambient CO₂ concentration by 75%, and a Gaussian-process Bayesian optimizer picks which operating conditions to test next, so each experiment teaches the most about capture performance.",
  stats: [
    { value: "75%", label: "ambient CO₂ reduction, bench validation" },
    { value: "6 W", label: "power draw, against a 120 W limit" },
    { value: "1 ft³", label: "the whole plant, fabricated in-house" },
  ],
  figures: [
    {
      kind: "image",
      src: "/work/cc/built-cube.webp",
      alt: "The finished reactor: two machined aluminum columns and their wiring inside a one-foot aluminum extrusion frame.",
      width: 1400,
      height: 1266,
      caption: "The built cube: two machined aluminum reactor columns in series inside a one-foot extrusion frame, with the pump, sensors and Arduino controller underneath.",
    },
    {
      kind: "image",
      src: "/work/cc/cad-isometric.webp",
      alt: "Two isometric CAD views of the reactor assembly with numbered part callouts.",
      width: 1400,
      height: 638,
      caption: "Parametric CAD of the full assembly, 43 numbered parts. The airflow distributors and sorbent screens were 3D printed and CNC machined from these models.",
    },
    {
      kind: "image",
      src: "/work/cc/process-flow.webp",
      alt: "Process flow diagram: feed air at 9.4 litres per minute passes through two reactors, dust filters, a desiccator and a vacuum pump to the outlet.",
      width: 1400,
      height: 737,
      caption: "Process flow: room air at 9.4 L/min is pulled through two sorbent beds in series, then dust filters and a desiccator, by a pump on the outlet side.",
    },
    {
      kind: "image",
      src: "/work/cc/tga-uptake.webp",
      alt: "Adsorption curve rising from 0 to about 0.175 millimoles per gram over roughly 180 minutes.",
      width: 1400,
      height: 813,
      caption: "Thermogravimetric test of the amine sorbent under 406 ppm CO₂: uptake climbs to 0.1745 mmol/g, about 7.7 g of CO₂ per kilogram of sorbent.",
    },
  ],
  steps: [
    "Pull room air through the cube with a 12 V pump on the outlet side, so the beds sit under slight suction and nothing leaks out.",
    "Spread the flow evenly across two aluminum columns of amine-coated activated carbon, held on fine mesh screens, which bind CO₂ as the air passes.",
    "Filter dust and dry the air downstream, keeping fines and moisture out of the pump.",
    "Watch temperature and pressure with an Arduino that slows the pump at 45 °C or 4 psig and shuts it off at 50 °C or 5 psig.",
    "Feed each run's capture result to the Bayesian optimizer, which proposes the next flow and operating conditions to test.",
  ],
  limits: "In progress: the design package for the November 2026 competition is held back until after judging, so this page shows selected figures only. Regenerating the sorbent with a heated nitrogen sweep is designed and costed but not yet built.",
};
