import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "robotech-hackathon",
    title: "IEEE Robotech 2026 Hackathon — Autonomous Track",
    description:
      "Designed and CAD-modeled a fully autonomous debris-clearing robot in SolidWorks. Developed a YOLO-based CV model in PyTorch achieving 95% debris detection accuracy. Integrated perception, navigation, and actuation systems for end-to-end autonomous operation.",
    tech: ["Python", "PyTorch", "YOLO", "SolidWorks", "Embedded Systems"],
    category: "Hardware",
    github: "#",
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
    tech: ["Python", "FastAPI", "SQLite", "Upstash Redis", "Node.js"],
    category: "Software",
    github: "https://github.com/sumedhk0/EcoFlow",
    live: "https://eco-flow-rose.vercel.app/",
  },
  {
    id: "github-analyzer",
    title: "GitHub Analyzer",
    description:
      "Analyzes user commit history for code quality, consistency, and hireability metrics.",
    tech: ["Python", "Node.js"],
    category: "Software",
    github: "https://github.com/sumedhk0/github_analyzer",
    live: "https://github-analyzer-navy.vercel.app/",
  },
  {
    id: "resumeforge",
    title: "ResumeForge",
    description:
      "AI-assisted resume tailoring system that adapts resumes to specific job descriptions using parsing and structured transformation.",
    tech: ["Python", "Node.js"],
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
