import { skills } from "@/data/skills";

const focusAreas = [
  "LLM Safety & Adversarial ML",
  "ML for Polymers & Materials",
  "Black-Box & Bayesian Optimization",
  "Computer Vision & 3D Reconstruction",
];

export function About() {
  return (
    <section id="about">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">About</h2>
      <p className="mb-4">
        Georgia Tech engineering student working at the intersection of machine
        learning, chemistry, and applied research. Most recently I built an
        adversarial self-play framework (GANs + SFT + GRPO + RLVR) for automated
        LLM jailbreak discovery at Witness.ai, and I now develop machine-learned
        force fields for polymers in the Ramprasad Laboratory. I also work on
        reinforcement-learning post-training of chemistry language models,
        surrogate-assisted optimization, and 4D Gaussian splatting.
      </p>
      <p className="mb-6">
        <span className="text-muted">Focus:</span> {focusAreas.join(" · ")}
      </p>
      <div className="space-y-1.5">
        {skills.map((category) => (
          <p key={category.name}>
            <span className="text-muted">{category.name}: </span>
            {category.skills.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
