import { Experience } from "@/lib/types";

export const experiences: Experience[] = [
  {
    id: "gt-rbi",
    role: "Research Intern",
    organization: "Georgia Tech Renewable Bioproducts Institute — Tong Laboratory",
    period: "August 2025 — Present",
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
    period: "February 2026 — Present",
    description: [
      "Designed and implemented a real-time lap tracking module in modern C++ for Georgia Tech’s Formula SAE Racing team, leveraging Protocol Buffers (Protobuf) for low-latency telemetry serialization and deterministic inter-process communication across vehicle subsystems",
      "Developing and deploying a YOLO-based object detection pipeline for driverless perception, enabling real-time cone detection and localization through C++ inference integration into the autonomous control stack",
    ]
  },
  {
    id: "cheme-cube",
    role: "Team Lead — Mechanical",
    organization: "ChemE Cube — Georgia Tech",
    period: "August 2025 — Present",
    description: [
      "Led a 5-member mechanical team overseeing end-to-end design and CAD of a 1 ft³ DAC system, resulting in a fully integrated prototype",
      "Designed and fabricated DAC hardware using 3D printing and CNC machining to build airflow pathways and zeolite containment",
      "Engineered the DAC system for a 75% ambient CO₂ reduction by optimizing contactor geometry and airflow–sorbent interaction, prepared for AIChE national conference evaluation",
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
