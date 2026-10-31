import { Experience } from "@/lib/types";

export const experiences: Experience[] = [
  {
    id: "ramprasad-lab",
    role: "Machine Learning Researcher",
    organization: "Ramprasad Laboratory — Georgia Tech",
    period: "August 2026 — Present",
    description: [
      "PolyFrameNet: built a polymer MLIP that enforces exact O(3) and permutation symmetry with plain MLPs, avoiding costly equivariant tensor products, by splitting chains into graph-defined rigid blocks with local frames and Weisfeiler–Lehman frame averaging",
      "Achieved 2.5–5.5× faster inference and 3.4–6.4× less GPU memory than MACE at an equal training budget (90 min, one L40S) on 876K-atom OPoly26, and scaled to 26K-atom polymer melts where both MACE and Allegro run out of memory",
      "Open-sourced PyTorch/ASE code and weights with an 81-test correctness suite and a registry flagging unseen chemical blocks",
      "PolyDYN: building a multi-agent LLM framework for autonomous polymer design with MLIP-driven property screening",
    ],
  },
  {
    id: "witness-ai",
    role: "Machine Learning Intern",
    organization: "Witness AI — Mountain View, CA",
    period: "May 2026 — September 2026",
    description: [
      "Generated 10K jailbreak prompts (60% attack success on Claude, Qwen, Gemma) to train a prompt-safety classifier by building an adversarial self-play framework with SFT, generative adversarial training, GRPO-based RLVR, and Thompson sampling",
      "Converted 1,000+ arXiv papers into novel attack strategies and adversarial data for training and evaluating LLM safety classifiers and jailbreak guards by building LiLAC (Living Literature Adversarial Corpus), a fully autonomous agentic research pipeline",
      "Benchmarked 8 state-of-the-art open-source and proprietary LLMs and fine-tuned 3 safety classifiers on 3,000+ synthesized adversarial prompts by developing a scalable evaluation framework that also automated customer-facing LLM safety reports",
    ],
  },
  {
    id: "cheme-cube",
    role: "Software, Mechanical, & Electrical Lead",
    organization: "ChemE Cube — Georgia Tech",
    period: "August 2025 — Present",
    description: [
      "Accelerated CO₂-capture reactor optimization by developing a Gaussian-process Bayesian optimization framework that learns a surrogate model of capture performance from experimental data and selects the highest-value operating conditions to test next",
      "Delivered a fully fabricated, test-ready 1 ft³ direct air capture (DAC) reactor for the AIChE ChemE Cube competition (Nov 2026) by leading a 10-member mechanical subteam through end-to-end CAD, prototyping, fabrication, and full systems integration",
      "Achieved a 75% reduction in ambient CO₂ concentration in bench-scale validation of the full direct air capture prototype by designing its airflow distribution and sorbent containment subsystems with parametric CAD, 3D printing, and CNC machining",
    ],
  },
  {
    id: "gt-rbi",
    role: "Research Intern",
    organization: "Georgia Tech Renewable Bioproducts Institute — Tong Laboratory",
    period: "August 2025 — May 2026",
    description: [
      "Applied Bayesian statistical modeling using Python and NumPy/Pandas to optimize lignin valorization reaction conditions",
      "Utilized NMR, SEM, and HPLC modeling data to characterize value-added chemicals from lignin breakdown",
      "Completed literature reviews on aromatic compound synthesis, 3D printing custom GO structures, and optimal catalyst design while collaborating on manuscript for publication",
    ],
  },
  {
    id: "gt-hytech",
    role: "Embedded Systems Engineer",
    organization: "HyTech Racing — Georgia Tech",
    period: "February 2026 — May 2026",
    description: [
      "Designed and implemented a real-time lap tracking module in modern C++ for Georgia Tech’s Formula SAE Racing team, leveraging Protocol Buffers (Protobuf) for low-latency telemetry serialization and deterministic inter-process communication across vehicle subsystems",
      "Developed a YOLO-based object detection pipeline for driverless perception, enabling real-time cone detection and localization through C++ inference integration into the autonomous control stack",
    ],
  },
  {
    id: "dressen-lab",
    role: "Researcher",
    organization: "Dressen Laboratory",
    period: "August 2024 — June 2025",
    description: [
      "Designed and tested fluorinated Mg₂(dobpdc) metal-organic frameworks for vehicle exhaust CO₂ capture, improving capture potential by 20% and stability by 115%",
      "Characterized adsorption efficiency and regeneration performance using TGA, NMR, and cyclic adsorption experiments",
      "Presented findings at SYNOPSYS 2025",
    ],
  },
  {
    id: "herc",
    role: "Simulation Intern",
    organization: "Hydrogen Engineering Research Consortium",
    period: "August 2024 — February 2025",
    description: [
      "Used MATLAB and dimensionless differential equations to model species concentrations in eutrophic freshwater ecosystems",
      "Employed sustainability over sets calculation to determine equilibria and stability of environment",
      "Co-authored research paper on environmental systems modeling under UCLA faculty mentorship",
    ],
  },
];
