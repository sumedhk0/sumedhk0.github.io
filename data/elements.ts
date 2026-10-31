import { ElementRecord } from "@/lib/types";

// The periodic table of work. Start dates follow the spec's precedence:
// resume > experience periods > event date > repo creation month.
// Numbers are assigned by lib/elements.ts (newest = 1), never by hand.
export const ELEMENTS: ElementRecord[] = [
  {
    slug: "pf", symbol: "Pf", name: "PolyFrameNet", family: "materials", start: "2026-08", kind: "full",
    oneLiner: "2.5–5.5× faster than MACE; scales to 26K-atom melts",
    tech: ["MLIP", "Frame averaging", "PyTorch", "ASE"],
    links: [{ label: "GitHub", href: "https://github.com/sumedhk0/PolyFrameNet" }],
  },
  {
    slug: "dy", symbol: "Dy", name: "PolyDYN", family: "materials", start: "2026-08", kind: "card",
    oneLiner: "Multi-agent LLMs for polymer design (in progress)",
    tech: ["Multi-agent LLMs", "MLIPs", "Polymer design"],
    links: [],
  },
  {
    slug: "pt", symbol: "Pt", name: "PolyT5-RLVR", family: "materials", start: "2026-08", kind: "full",
    oneLiner: "−79% invalid polymers; 99% of Tg control restored",
    tech: ["T5", "GRPO", "RLVR", "Conformal prediction"],
    links: [{ label: "GitHub", href: "https://github.com/sumedhk0/POLYT5-RLVR" }],
  },
  {
    slug: "as", symbol: "As", name: "Adversarial self-play", family: "safety", start: "2026-05", kind: "restricted",
    oneLiner: "10K jailbreak prompts at 60% attack success",
    tech: ["GRPO", "SFT", "RLVR", "Thompson sampling"],
    links: [],
  },
  {
    slug: "li", symbol: "Li", name: "LiLAC", family: "safety", start: "2026-05", kind: "restricted",
    oneLiner: "1,000+ arXiv papers turned into adversarial training data",
    tech: ["Agentic pipelines", "LLM safety", "HuggingFace"],
    links: [],
  },
  {
    slug: "pp", symbol: "Pp", name: "Panoptic Pigskin", family: "vision", start: "2026-02", kind: "full",
    oneLiner: "3D NFL plays from two broadcast angles, 0.15 m median error",
    tech: ["YOLOv8", "SMPL-X", "OpenCV", "Gaussian splatting"],
    links: [
      { label: "Live", href: "https://panopticpigskin.tech" },
      { label: "Film Room", href: "https://panopticpigskin.tech/playground" },
      { label: "Report", href: "https://panopticpigskin.tech/report" },
      { label: "GitHub", href: "https://github.com/sumedhk0/PanopticPigskin" },
    ],
  },
  {
    slug: "ps", symbol: "Ps", name: "ML-assisted PSO", family: "optimization", start: "2026-03", kind: "full",
    oneLiner: "Beat vanilla PSO by 90.4% on Ackley with learned repositioning",
    tech: ["Gaussian processes", "LightGBM", "Python"],
    links: [{ label: "GitHub", href: "https://github.com/sumedhk0/ML-Assisted-Particle-Swarm-Optimization" }],
  },
  {
    slug: "gs", symbol: "Gs", name: "GameSense", family: "vision", start: "2026-03", kind: "full",
    oneLiner: "Directional haptics for deaf gamers; TechHack Valley winner",
    tech: ["ESP32", "C++", "IMU", "Bluetooth LE"],
    links: [
      { label: "Devpost", href: "https://devpost.com/software/gamesense-78fswv" },
      { label: "Video", href: "https://www.youtube.com/watch?v=MPyTruaT-h8" },
      { label: "GitHub", href: "https://github.com/sumedhk0/Game-Sense-TechHackValley" },
    ],
  },
  {
    slug: "rb", symbol: "Rb", name: "Robotech debris robot", family: "vision", start: "2026-01", kind: "full",
    oneLiner: "Autonomous lunar-zone rover with on-board YOLO debris detection",
    tech: ["YOLO11", "Raspberry Pi", "SolidWorks"],
    links: [
      { label: "Devpost", href: "https://devpost.com/software/buzzinga-robotech-submission" },
      { label: "Video", href: "https://www.youtube.com/watch?v=cWmjeuB-yqk" },
      { label: "GitHub", href: "https://github.com/wschotte/buzzinga-robotech-2026" },
    ],
  },
  {
    slug: "gt", symbol: "Gt", name: "GT Transfer Equivalencies", family: "software", start: "2026-04", kind: "full",
    oneLiner: "2,076 schools and 104,073 course mappings, refreshed nightly",
    tech: ["Python", "BeautifulSoup", "GitHub Actions"],
    links: [
      { label: "Live", href: "https://sumedhk0.github.io/GTTransferEquivalency/" },
      { label: "GitHub", href: "https://github.com/sumedhk0/GTTransferEquivalency" },
    ],
  },
  {
    slug: "cc", symbol: "Cc", name: "ChemE Cube DAC reactor", family: "optimization", start: "2025-08", kind: "full",
    oneLiner: "Bayesian-optimized DAC reactor; 75% ambient CO₂ reduction",
    tech: ["Bayesian optimization", "CAD", "CNC"],
    links: [],
  },
  {
    slug: "ht", symbol: "Ht", name: "HyTech Racing", family: "vision", start: "2026-02", kind: "card",
    oneLiner: "Real-time lap tracking and telemetry in C++ for Formula SAE",
    tech: ["C++", "Protobuf", "YOLO"],
    links: [],
  },
  {
    slug: "lg", symbol: "Lg", name: "Lignin valorization", family: "chemistry", start: "2025-08", kind: "card",
    oneLiner: "Bayesian modelling of lignin valorization reaction conditions",
    tech: ["Bayesian modelling", "NMR", "HPLC"],
    links: [],
  },
  {
    slug: "mf", symbol: "Mf", name: "Fluorinated MOFs", family: "chemistry", start: "2024-08", kind: "card",
    oneLiner: "+20% CO₂ capture and +115% stability in fluorinated MOFs",
    tech: ["MOF synthesis", "TGA", "NMR"],
    links: [],
  },
  {
    slug: "ar", symbol: "Ar", name: "Sports betting arbitrage", family: "software", start: "2025-11", kind: "card",
    oneLiner: "Live odds across sportsbooks turned into arbitrage bets",
    tech: ["Python", "REST APIs", "Docker"],
    links: [
      { label: "Live", href: "https://sports-betting-arbitrage-theta.vercel.app/" },
      { label: "GitHub", href: "https://github.com/sumedhk0/Sports-Betting-Arbitrage" },
    ],
  },
  {
    slug: "ef", symbol: "Ef", name: "EcoFlow", family: "software", start: "2026-02", kind: "card",
    oneLiner: "Cradle-to-grave life-cycle analysis for Amazon products",
    tech: ["FastAPI", "Next.js", "Redis"],
    links: [
      { label: "Live", href: "https://eco-flow-rose.vercel.app/" },
      { label: "GitHub", href: "https://github.com/sumedhk0/EcoFlow" },
    ],
  },
  {
    slug: "rf", symbol: "Rf", name: "ResumeForge", family: "software", start: "2025-12", kind: "card",
    oneLiner: "LLM resume tailoring to a job description, compiled to PDF",
    tech: ["FastAPI", "LaTeX", "LLMs"],
    links: [
      { label: "Live (may take a moment to wake)", href: "https://huggingface.co/spaces/sk31415/resume-forge" },
      { label: "GitHub", href: "https://github.com/sumedhk0/ResumeForge" },
    ],
  },
  {
    slug: "ga", symbol: "Ga", name: "GitHub Analyzer", family: "software", start: "2025-12", kind: "card",
    oneLiner: "LLM-rated code quality from a developer's commit history",
    tech: ["Python", "Flask", "GitHub API"],
    links: [
      { label: "Live", href: "https://github-analyzer-navy.vercel.app/" },
      { label: "GitHub", href: "https://github.com/sumedhk0/github_analyzer" },
    ],
  },
];

/** Which element a research or project record belongs to (ids from data/research.ts and data/projects.ts). */
export const ELEMENT_OF: Record<string, string> = {
  polyframenet: "pf",
  polydyn: "dy",
  "adversarial-self-play": "as",
  lilac: "li",
  "ml-pso": "ps",
  "lignin-valorization": "lg",
  "mof-carbon-capture": "mf",
  "polyt5-rlvr": "pt",
  "panoptic-pigskin": "pp",
  "techhackvalley-hackathon": "gs",
  "robotech-hackathon": "rb",
  "gt-transfer-equivalency": "gt",
  "arbitrage-engine": "ar",
  ecoflow: "ef",
  "github-analyzer": "ga",
  resumeforge: "rf",
};
