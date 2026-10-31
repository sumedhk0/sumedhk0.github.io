import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "polyt5-rlvr",
    title: "PolyT5-RLVR — Polymer Encoder-Decoder Model",
    description:
      "Rebuilt PolyT5 from scratch, a 7.46M-parameter T5 pretrained on 92.3M polymers, landing in the paper's accuracy band (Tg RMSE 44.45 vs 40.82 K). Post-trained the generator with GRPO against chemistry-verifiable rewards: the validity reward raised the valid-polymer rate from 52.6% to 90.1%, but every chemistry reward also destroyed target-Tg control (conditioning slope 0.904 → ~0.3). A stronger KL anchor recovered under 5% of the loss; supervised replay recovered 99% (slope 0.973) while keeping +12.5 points of validity. On prediction, a linear regression head cut Tg error 5.2% (28.60 → 27.11 K) and beat the baseline on all 10 split-seed pairs of a 70-run ablation. Split-conformal intervals give ±54.35 K at 90% coverage.",
    tech: ["Python", "PyTorch", "T5", "GRPO", "RLVR", "Conformal Prediction"],
    category: "Research",
    github: "https://github.com/sumedhk0/POLYT5-RLVR",
  },
  {
    id: "polyuma",
    title: "PolyUMA — Semiconducting Polymer Property Predictor",
    description:
      "Graph neural network materials-property model (inspired by Meta's eSEN) trained on 6M+ OPoly26 datapoints to learn structure–property relationships in semiconducting polymers, force fields, and interatomic potentials. Built a physics-informed molecular representation pipeline (backbone planarity, π–π stacking, chain rigidity) and an iterative self-refinement training loop with domain-seeded anchoring. Submitted to the Adaptation Autoscientist Challenge.",
    tech: ["Python", "PyTorch", "Graph Neural Networks", "CUDA"],
    category: "Software",
    github: "#",
  },
  {
    id: "panoptic-pigskin",
    title: "Panoptic Pigskin — NFL 4D Gaussian Splatting",
    description:
      "Reconstructs NFL plays in 3D from two broadcast camera angles. On a play with official 10 Hz NFL tracking data, the solved camera geometry places held-out players at 0.15 m median error, 41× below per-frame calibration. A YOLOv8x-pose model is self-trained per play on ~115K keypoint labels, and smoothing each track along its camera's depth axis cut physically implausible motion from 17% to 5.5% of body-frames. Powers free-viewpoint Gaussian-splat replays and a per-player report with automatically measured time to throw, air yards, YAC and separation.",
    tech: ["Python", "YOLOv8", "SMPL-X", "SMPLest-X", "EasyOCR", "OpenCV", "SciPy", "Gaussian Splatting"],
    category: "Software",
    github: "https://github.com/sumedhk0/PanopticPigskin",
    live: "https://panopticpigskin.tech",
  },
  {
    id: "techhackvalley-hackathon",
    title: "GameSense - Winners - TechHack Valley 2026 Hackathon - Hardware Track",
    description:
      "Engineered a real-time accessibility wearable for deaf gamers converting spatial audio → multi-channel haptic feedback via directional vibration. Built full hardware stack (ESP32, 9-axis IMU, 8-motor array, 3D-printed enclosure) and wrote C++ firmware for PWM motor control and UART communication. Implemented audio amplitude → haptic intensity mapping and Kalman-filtered head-tilt → WASD motion input.",
    tech: ["Python", "C++", "Embedded Systems", "Fusion", "WASAPI"],
    category: "Hardware",
    github: "https://github.com/sumedhk0/Game-Sense-TechHackValley",
    live: "https://devpost.com/software/gamesense-78fswv",
  },
  {
    id: "robotech-hackathon",
    title: "IEEE Robotech 2026 Hackathon — Autonomous Track",
    description:
      "Designed and CAD-modeled a fully autonomous debris-clearing robot in SolidWorks. Developed a YOLO-based CV model in PyTorch achieving 95% debris detection accuracy. Integrated perception, navigation, and actuation systems for end-to-end autonomous operation.",
    tech: ["Python", "PyTorch", "YOLO", "SolidWorks", "Embedded Systems"],
    category: "Hardware",
    github: "https://github.com/wschotte/buzzinga-robotech-2026",
    live: "https://devpost.com/software/buzzinga-robotech-submission",
  },
  {
    id: "gt-transfer-equivalency",
    title: "GT Transfer Equivalencies — Reverse Transfer Search",
    description:
      "Searchable mirror of Georgia Tech's transfer equivalency table, flipped around: pick a GT course and see every school whose course transfers in, filterable by US state or community colleges only. Nightly GitHub Actions scraper (requests/BeautifulSoup) pulls OSCAR equivalencies for 2,000+ institutions (100k+ course mappings across 1,400+ GT courses), joins them against the federal College Scorecard API for state and degree-level data, and publishes a single JSON dataset consumed by a static client-side search UI on GitHub Pages. Includes a CLI for one-off queries.",
    tech: ["Python", "BeautifulSoup", "GitHub Actions", "JavaScript", "College Scorecard API"],
    category: "Software",
    github: "https://github.com/sumedhk0/GTTransferEquivalency",
    live: "https://sumedhk0.github.io/GTTransferEquivalency/",
  },
  {
    id: "ai-applier",
    title: "AiApply — AI Job Applier",
    description:
      "Full-stack AI-powered internship application platform automating end-to-end job search workflows — resume optimization, cover letter generation, programmatic Handshake submission, recruiter scraping, and automated personalized outreach at scale.",
    tech: ["Python", "Selenium WebDriver", "HTML", "JavaScript"],
    category: "Software",
    github: "https://github.com/sumedhk0/",
    live: "https://ai-apply-12tq.onrender.com/",
  },
  {
    id: "arbitrage-engine",
    title: "Sports Betting Arbitrage Engine",
    description:
      "Aggregates live odds from multiple sportsbooks via API, normalizes data, and identifies risk-free arbitrage opportunities across H2H, Spread, and Total markets with up to 50% daily ROI. Production-ready pipeline with Dockerization and real-time analysis.",
    tech: ["Python", "REST APIs", "Docker"],
    category: "Software",
    github: "https://github.com/sumedhk0/Sports-Betting-Arbitrage",
    live: "https://sports-betting-arbitrage-theta.vercel.app/",
  },
  {
    id: "ecoflow",
    title: "EcoFlow",
    description:
      "Full cradle-to-grave life cycle analyzer for Amazon products. Includes Sankey diagram visualization and scalable backend architecture.",
    tech: ["Python", "FastAPI", "SQLite", "Upstash Redis", "Next.js"],
    category: "Software",
    github: "https://github.com/sumedhk0/EcoFlow",
    live: "https://eco-flow-rose.vercel.app/",
  },
  {
    id: "github-analyzer",
    title: "GitHub Analyzer",
    description:
      "Analyzes user commit history for code quality, consistency, and hireability metrics.",
    tech: ["Python", "Next.js"],
    category: "Software",
    github: "https://github.com/sumedhk0/github_analyzer",
    live: "https://github-analyzer-navy.vercel.app/",
  },
  {
    id: "resumeforge",
    title: "ResumeForge",
    description:
      "AI-assisted resume tailoring system that adapts resumes to specific job descriptions using parsing and structured transformation.",
    tech: ["Python", "Next.js"],
    category: "Software",
    github: "https://github.com/sumedhk0/ResumeForge",
    live: "https://huggingface.co/spaces/sk31415/resume-forge",
  },
  {
    id: "crop-predictor",
    title: "Sustainable Farming Crop Growth Predictor",
    description:
      "Implemented AI/ML models (MLP, linear regression, KNN, decision trees) to analyze crop growth from 30+ bacterial strain features. Optimized predictive pipeline to identify high-performing farms by soil type, achieving 160% higher accuracy over random baseline.",
    tech: ["Python", "NumPy", "Pandas", "Scikit-learn"],
    category: "Software",
    github: "#",
  },
];
