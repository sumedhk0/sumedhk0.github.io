import type { Findings } from "./types";

// Every number below is traceable to docs/superpowers/research/*.md and the
// CSV/JSON under content/data/ (tests/chart-data.test.ts checks the charts).

export const pf: Findings = {
  slug: "pf",
  dates: "August 2026 – present",
  affiliation: "Ramprasad Laboratory · Georgia Tech",
  lead: "Polymer simulations need machine-learned potentials that stay fast at tens of thousands of atoms. PolyFrameNet splits each chain into rigid blocks with their own coordinate frames, so plain MLPs replace costly equivariant tensor products while symmetry stays exact. At an equal training budget it runs 2.5–5.5× faster than MACE with 3.4–6.4× less GPU memory, and it simulates 26K-atom polymer melts where MACE and Allegro run out of memory.",
  figures: [
    {
      kind: "image",
      src: "/work/pf/architecture.webp",
      alt: "Architecture diagram: a polystyrene chain cut into CH2, CH and phenyl-ring blocks, each with a local frame, feeding a block encoder, bonded message passing and a many-body layer, with frame averaging before the energy.",
      width: 1400,
      height: 1563,
      caption: "How the model is built: bonds define rigid blocks, Weisfeiler–Lehman colour classes define each block's frames, and every stage is averaged over frames before energy and forces.",
    },
    {
      kind: "chart",
      chartId: "pf-speed",
      caption: "Time per MD step on one L40S after 90 minutes of training each. PolyFrameNet is 2.55× faster than MACE at 976 atoms and 5.51× faster at 7,808, and still runs at 26,352.",
    },
    {
      kind: "chart",
      chartId: "pf-memory",
      caption: "Peak GPU memory. At 7,808 atoms PolyFrameNet needs 3.62 GB to MACE's 12.35 GB; it is the only model that fits a 26,352-atom melt on the 46 GB card.",
    },
    {
      kind: "chart",
      chartId: "pf-ablation",
      caption: "Design lesson from eight-minute ablations: letting the many-body layer see every neighbour pair cut test force error from 115.6 to 34.4 meV/Å.",
    },
  ],
  steps: [
    "Read covalent bonds once and freeze them, then cut the bond graph into rigid blocks: ring systems, other heavy atoms, and their hydrogens.",
    "Build each block's local frames from Weisfeiler–Lehman colour classes, so the set of frames is closed under rotation, reflection and relabelling.",
    "Encode each block in its own frame with one shared MLP, pass messages along bonds, and add a 4.5 Å many-body layer built from Cartesian moments.",
    "Average every stage over all frame variants, which makes the energy exactly O(3)- and permutation-invariant with no discontinuities.",
    "Sum per-atom energies with Coulomb and dispersion terms; forces are exact gradients by autodiff.",
    "A block registry flags chemistries outside the training set at inference, so users know when a prediction extrapolates.",
  ],
  limits: "The speed comes at some accuracy cost: on mixed hydrocarbons its force error is 43.4 meV/Å against MACE's 19.7.",
};

export const pt: Findings = {
  slug: "pt",
  dates: "August – September 2026",
  lead: "I rebuilt the Ramprasad Lab's PolyT5 from scratch, a 7.46M-parameter T5 pretrained on 92.3M polymers, and matched the paper's accuracy band (Tg RMSE 44.45 vs 40.82 K). Post-training it with GRPO against chemistry-verifiable rewards cut invalid polymer generations by 79%, and supervised replay then restored 99% of the target-Tg control that the rewards had erased. A regression head cut Tg prediction error 5.2%.",
  figures: [
    {
      kind: "chart",
      chartId: "pt-frontier",
      caption: "Tg-conditioning slope (1.0 means generated polymers hit the requested Tg). Chemistry rewards raised validity but erased conditioning; a stronger KL anchor barely helped; supervised replay restored it to 0.973.",
    },
    {
      kind: "chart",
      chartId: "pt-ablation",
      caption: "Tg prediction error across a 70-run ablation (7 arms × 5 splits × 2 seeds). Only the regression head clears the pre-registered 27.91 K bar, winning on all 10 split–seed pairs.",
    },
    {
      kind: "chart",
      chartId: "pt-scaling",
      caption: "Pretraining pays: Tg RMSE falls from 62.39 K with no pretraining to 44.45 K at 92.3M polymers, close to the paper's 40.82 K on its withheld 100M corpus.",
    },
  ],
  steps: [
    "Rebuild T5 in PyTorch with no pretrained weights and pretrain it by span corruption on 92.3M polymers from polyOne.",
    "Fine-tune two tasks: Tg prediction and Tg-conditioned polymer generation, then freeze the result as a hashed baseline.",
    "Post-train generation with GRPO: sample 16 candidates per prompt and score them with RDKit validity, novelty, synthesizability and diversity rewards.",
    "Score every arm against a frozen protocol with a held-out auditor model that never enters a reward.",
    "Fix the lost conditioning by mixing a supervised loss on known polymer–Tg pairs into the GRPO objective.",
    "Replace text decoding with a regression head for prediction and wrap it in split-conformal intervals (±54.35 K at 90% coverage).",
  ],
};

export const ps: Findings = {
  slug: "ps",
  dates: "March – May 2026",
  affiliation: "PACESHIP Scholar grant · Georgia Tech",
  lead: "Particle swarms stall in high dimensions. With a $1,000 PACESHIP grant I added a learned rescue layer to Gaussian-process-guided PSO: a LightGBM classifier spots stuck particles and the GP sends them to promising or unexplored regions. At 50 dimensions it beat vanilla PSO by 90.4% on Ackley, 53.6% on Rastrigin and 23.6% on Rosenbrock.",
  figures: [
    {
      kind: "chart",
      chartId: "ps-objective",
      caption: "Final error of the best ML-assisted variant as a percentage of vanilla PSO (median of 51 seeds, 50 dimensions). Below 100 is better.",
    },
    {
      kind: "chart",
      chartId: "ps-ml-gain",
      caption: "What the learned layer adds on its own: final-error reduction versus the same GP-guided optimizer without it, best variant per function (38–96% across all strong variants).",
    },
  ],
  steps: [
    "Run a tensorized swarm and fit an exact Gaussian process to a curated memory of past evaluations.",
    "Steer particles with GP-directed rules: move toward predicted optima or relocate through acquisition searches.",
    "Train a LightGBM classifier offline on about 500 swarm trajectories to recognise stuck particles from 11 features.",
    "Every few iterations, send the 20% most-stuck particles half to the GP's confidence-bound minimum and half to its most uncertain point.",
    "Benchmark against vanilla PSO on five functions at 50 dimensions, 51 seeds each, on Georgia Tech's PACE cluster.",
  ],
  limits: "Gains are not uniform: Griewank still favours vanilla PSO, and the learned layer adds 3.5–22.6% to runtime.",
};
