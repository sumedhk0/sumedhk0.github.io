import { Experience } from "@/lib/types";

export const experiences: Experience[] = [
  {
    id: "ramprasad-lab",
    role: "Machine Learning Researcher",
    organization: "Ramprasad Laboratory — Georgia Tech",
    period: "July 2026 — Present",
    description: [
      "PolyFrameNet: designed a block-factored polymer MLIP that factors chains into graph-defined rigid blocks with local coordinate frames, replacing equivariant tensor products with plain MLPs while guaranteeing exact O(3) and permutation symmetry via Weisfeiler–Lehman frame averaging",
      "Achieved 2.5–5.5× faster inference and 3.4× less GPU memory than MACE and Allegro at a matched training budget (90 min, one L40S) on 876K-atom OPoly26 data; matched MACE force error on polyethylene (13.7 meV/Å) and scaled to 26K-atom melts",
      "Open-sourced the PyTorch/ASE implementation and trained weights with an 81-test correctness suite and a block registry that flags chemistries outside the training set, so users know when predictions extrapolate",
      "PolyDYN: building a multi-agent LLM framework for autonomous polymer design and discovery with MLIP-driven property screening",
    ],
  },
  {
    id: "witness-ai",
    role: "Machine Learning Intern",
    organization: "Witness AI — Mountain View, CA",
    period: "May 2026 — September 2026",
    description: [
      "Built an adversarial self-play framework for automated jailbreak discovery that combines generative adversarial training, SFT, and GRPO with verifiable rewards, optimizing attack policies via iterative reward-based learning and Thompson sampling; generated 10,000 jailbreak prompts reaching 60% attack success on Claude, Qwen, and Gemma, used to train a prompt-safety classifier",
      "Built LiLAC (Living Literature Adversarial Corpus), an end-to-end agentic research pipeline in Python (PyTorch, vLLM, HuggingFace) that autonomously processed 1,000+ arXiv papers, synthesized emerging LLM red-teaming methods, and continuously converted them into novel attack strategies and adversarial data for training and evaluating LLM safety classifiers and jailbreak guards",
      "Developed a scalable evaluation framework that generated 3,000+ adversarial prompts, benchmarked 8 state-of-the-art open-source and proprietary LLMs, fine-tuned 3 safety classifiers on the synthesized data, and automated customer-facing safety reports",
    ],
  },
  {
    id: "cheme-cube",
    role: "Software & Mechanical Lead",
    organization: "ChemE Cube — Georgia Tech",
    period: "August 2025 — Present",
    description: [
      "Developed a Gaussian-process Bayesian optimization framework for CO₂ capture experiments that learns a surrogate model of capture performance from experimental data and selects the next high-value operating conditions to test, accelerating reactor optimization",
      "Lead mechanical development of a 1 ft³ direct air capture reactor for the AIChE ChemE Cube competition (Nov 2026), managing a 5-member subteam through end-to-end CAD, prototyping, and systems integration into a fully fabricated, test-ready prototype",
      "Designed airflow distribution and sorbent containment subsystems using parametric CAD, 3D printing, and CNC machining, achieving a 75% reduction in ambient CO₂ concentration during bench-scale validation of the full direct air capture prototype",
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
