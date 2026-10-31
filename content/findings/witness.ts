import type { Findings } from "./types";

// Witness AI work is confidential: resume wording and resume numbers only.
// No figures, diagrams or method detail beyond the resume.

export const as: Findings = {
  slug: "as",
  dates: "May – September 2026",
  affiliation: "Witness AI · Mountain View, CA",
  lead: "Generated 10K jailbreak prompts (60% attack success on Claude, Qwen, Gemma) to train a prompt-safety classifier by building an adversarial self-play framework with SFT, generative adversarial training, GRPO-based RLVR, and Thompson sampling.",
  figures: [],
  steps: [],
  stats: [
    { value: "10K", label: "jailbreak prompts generated" },
    { value: "60%", label: "attack success on Claude, Qwen and Gemma" },
  ],
};

export const li: Findings = {
  slug: "li",
  dates: "May – September 2026",
  affiliation: "Witness AI · Mountain View, CA",
  lead: "Converted 1,000+ arXiv papers into novel attack strategies and adversarial data for training and evaluating LLM safety classifiers and jailbreak guards by building LiLAC (Living Literature Adversarial Corpus), a fully autonomous agentic research pipeline. A companion evaluation framework benchmarked 8 state-of-the-art open-source and proprietary LLMs, fine-tuned 3 safety classifiers on 3,000+ synthesized adversarial prompts, and automated customer-facing LLM safety reports.",
  figures: [],
  steps: [],
  stats: [
    { value: "1,000+", label: "arXiv papers processed" },
    { value: "3,000+", label: "adversarial prompts synthesized" },
    { value: "8", label: "LLMs benchmarked" },
    { value: "3", label: "safety classifiers fine-tuned" },
  ],
};
