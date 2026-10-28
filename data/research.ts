import { Research } from "@/lib/types";

export const research: Research[] = [
  {
    id: "polyframenet",
    title: "PolyFrameNet — Block-Factored Polymer MLIP",
    organization: "Ramprasad Laboratory — Georgia Tech",
    description:
      "A polymer machine-learned interatomic potential that factors chains into graph-defined rigid blocks with local coordinate frames, replacing equivariant tensor products with plain MLPs while guaranteeing exact O(3) and permutation symmetry via Weisfeiler–Lehman frame averaging. Runs 2.5–5.5× faster with 3.4× less GPU memory than MACE and Allegro at a matched training budget (90 min, one L40S) on 876K-atom OPoly26 data, matches MACE force error on polyethylene (13.7 meV/Å), and scales to 26K-atom melts. Open-sourced as a PyTorch/ASE implementation with trained weights, an 81-test correctness suite, and a block registry that flags chemistries outside the training set.",
    methods: ["MLIPs", "Frame Averaging", "PyTorch", "ASE", "MACE", "Allegro"],
    status: "In Progress",
  },
  {
    id: "polydyn",
    title: "PolyDYN — Multi-Agent Polymer Discovery",
    organization: "Ramprasad Laboratory — Georgia Tech",
    description:
      "A multi-agent LLM framework for autonomous polymer design and discovery, using MLIP-driven property screening to evaluate candidate polymers.",
    methods: ["Multi-Agent LLMs", "MLIPs", "Polymer Design"],
    status: "In Progress",
  },
  {
    id: "adversarial-self-play",
    title: "Adversarial Self-Play for Automated LLM Jailbreak Optimization",
    organization: "Witness AI",
    description:
      "Adversarial self-play framework combining generative adversarial training, SFT, and GRPO with verifiable rewards, in which an attacker model learns to generate jailbreak prompts through iterative reward-based policy optimization and Thompson sampling. Generated 10,000 jailbreak prompts reaching 60% attack success on Claude, Qwen, and Gemma, used to train a prompt-safety classifier.",
    methods: ["GRPO", "SFT", "RLVR", "GANs", "Thompson Sampling", "LLM Red-Teaming", "vLLM"],
    status: "Completed",
  },
  {
    id: "lilac",
    title: "LiLAC — A Living Literature Adversarial Corpus",
    organization: "Witness AI",
    description:
      "Introduces an automated framework for continuously converting emerging jailbreak research into adversarial data for training and evaluating LLM safety classifiers. Powered by an agentic pipeline that processed 1,000+ arXiv papers and synthesized 3,000+ adversarial prompts used to benchmark 8 LLMs and fine-tune 3 safety classifiers.",
    methods: ["Agentic Pipelines", "LLM Safety", "Classifier Fine-Tuning", "HuggingFace"],
    status: "Completed",
  },
  {
    id: "ml-pso",
    title: "ML-Assisted Particle Swarm Optimization",
    organization: "PACESHIP Scholar Research Grant",
    description:
      "Awarded a $1,000 grant to investigate ML methods for black-box optimization. Built a hybrid framework integrating Gaussian Process surrogate modeling, LightGBM-guided particle repositioning, and adaptive exploration–exploitation to identify stagnating particles and steer search trajectories. An autoresearch loop autonomously ran experiments, tuned hyperparameters, and refined strategies, achieving an average 28% improvement over baseline PSO across benchmarks (97.8% Sphere, 99.9% Rastrigin, 90.4% Ackley, 58.8% Rosenbrock).",
    methods: ["PyTorch", "Gaussian Processes", "LightGBM", "Surrogate Modeling", "Optimization"],
    status: "Completed",
  },
  {
    id: "lignin-valorization",
    title: "Bayesian Optimization for Lignin Valorization",
    organization: "Georgia Tech Renewable Bioproducts Institute — Tong Laboratory",
    description:
      "Applied Bayesian statistical modeling to optimize lignin valorization reaction conditions. Integrated NMR, SEM, and HPLC modeling data for structural characterization of value-added chemicals from lignin breakdown. Collaborating on manuscript for peer-reviewed publication.",
    methods: ["Bayesian Modeling", "NMR", "SEM", "HPLC", "Python", "NumPy", "Pandas"],
    status: "Completed",
  },
  {
    id: "mof-carbon-capture",
    title: "Fluorinated MOFs for CO₂ Capture",
    organization: "Dressen Laboratory",
    description:
      "Designed and tested fluorinated Mg₂(dobpdc) metal-organic frameworks for vehicle exhaust CO₂ capture. Improved capture potential by 20% and stability by 115%. Characterized performance using TGA, NMR, and cyclic adsorption experiments. Presented at SYNOPSYS 2025.",
    methods: ["MOF Synthesis", "Fluorination", "TGA", "NMR", "Materials Science"],
    status: "Completed",
  },
  {
    id: "pfas-remediation",
    title: "Short-Chain PFAS Remediation Technologies",
    organization: "Independent Research",
    description:
      "Conducted 35-page literature review assessing chemical and economic feasibility of PFAS removal techniques for environmental remediation. Collaborated with Yale's Dr. Julianne Rolf to validate research findings. Presented at the Symposium of Rising Scholars.",
    methods: ["Environmental Chemistry", "Literature Review", "Remediation"],
    status: "Completed",
  },
  {
    id: "greengrade",
    title: "GreenGrade — Sustainability Interval Index",
    organization: "Gemini API Developer Competition",
    description:
      "Directed 20-person UCLA team to architect a fuzzy logic-driven Sustainability Interval Index calculator with scalable data integration pipelines. Developed and deployed GreenGrade (Flutter/C++), automating sustainability analytics for 175 mining firms through Gemini API.",
    methods: ["Flutter", "C++", "Gemini API", "Fuzzy Logic", "Data Pipelines"],
    status: "Completed",
    github: "https://github.com/KOL305/GreenGradeV2",
  },
  {
    id: "eutrophication-modeling",
    title: "Freshwater Ecosystem Eutrophication Modeling",
    organization: "Hydrogen Engineering Research Consortium",
    description:
      "Used MATLAB and dimensionless differential equations to model species concentrations in eutrophic freshwater ecosystems. Employed sustainability over sets calculation to determine equilibria and stability. Co-authored research paper under UCLA faculty mentorship.",
    methods: ["MATLAB", "Differential Equations", "Ecosystem Modeling", "Stability Analysis"],
    status: "Completed",
  },
];
