import { skills } from "@/data/skills";
import { SectionHead } from "@/components/home/section-head";

const FOCUS = [
  "ML for polymers and materials",
  "LLM safety and adversarial ML",
  "Black-box and Bayesian optimization",
  "Computer vision and 3D reconstruction",
];

export function About() {
  return (
    <section id="about" className="sec">
      <SectionHead num="02" title="About" />
      <div className="about-grid">
        <div className="prose-col">
          <p>
            I am a Georgia Tech engineering student working where machine learning meets chemistry. In the Ramprasad
            Laboratory I am building PolyFrameNet, a block-factored interatomic potential that runs polymer simulations faster
            and at larger scale than equivariant models. Before that, at Witness AI, I built an adversarial self-play
            framework for automated LLM jailbreak discovery.
          </p>
          <p>
            I have also worked on reinforcement-learning post-training for polymer language models, surrogate-assisted
            optimization, and 3D reconstruction of NFL plays from broadcast footage.
          </p>
          <p className="label about-focus">Focus · {FOCUS.join(" · ")}</p>
        </div>
        <dl className="skills">
          {skills.map((c) => (
            <div key={c.name}>
              <dt className="label">{c.name}</dt>
              <dd>{c.skills.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
