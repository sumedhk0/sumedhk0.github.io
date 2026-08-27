import { Experience } from "@/lib/types";

export const experiences: Experience[] = [
  {
    id: "ramprasad-lab",
    role: "Machine Learning Researcher",
    organization: "Ramprasad Laboratory — Georgia Tech",
    period: "July 2026 — Present",
    description: [
      "Developing machine-learned force fields (MLFFs) for polymers: a two-body pairing message-passing graph neural network that serves as an accurate, efficient surrogate for polymer DFT calculations",
    ],
  },
  {
    id: "witness-ai",
    role: "Machine Learning Intern",
    organization: "Witness.ai — Mountain View, CA",
    period: "May 2026 — September 2026",
    description: [
      "Designed and implemented a novel adversarial ML framework combining GANs, SFT, GRPO, and RLVR to autonomously generate harmful prompts for discovering jailbreak vulnerabilities in modern LLMs (Claude Haiku, Qwen), reaching 60% ASR by optimizing attack-generation policies through iterative reward-based learning, with ongoing work toward an arXiv publication",
      "Engineered an end-to-end agentic research pipeline in Python (PyTorch, vLLM, HuggingFace) that autonomously processed 1,000+ arXiv papers, synthesized emerging LLM red-teaming methodologies, and generated novel adversarial attack strategies",
      "Built a scalable adversarial evaluation framework that generated 3,000+ adversarial prompts, benchmarked 8 state-of-the-art open-source and proprietary LLMs, fine-tuned 3 LLM safety classifiers on synthesized data, and produced automated customer-facing safety reports",
    ],
  },
  {
    id: "cheme-cube",
    role: "Software & Mechanical Lead",
    organization: "ChemE Cube — Georgia Tech",
    period: "August 2025 — Present",
    description: [
      "Developed a Gaussian-process Bayesian optimization framework for CO₂ capture experiments, learning a surrogate model of capture performance from experimental data and selecting high-value operating conditions to accelerate reactor optimization",
      "Leading the mechanical development of a 1 ft³ direct air capture reactor by managing a 5-member subteam and overseeing end-to-end CAD, prototyping, and systems integration, delivering a fully fabricated, test-ready prototype",
      "Designing airflow distribution and sorbent containment subsystems using parametric CAD, 3D printing, and CNC machining, achieving a 75% reduction of ambient CO₂ in bench-scale validation for the AIChE competition (Nov 2026)",
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
