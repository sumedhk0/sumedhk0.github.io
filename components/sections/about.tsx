import { skills } from "@/data/skills";

const focusAreas = [
  "AI & Machine Learning Systems",
  "Robotics & Computer Vision",
  "Materials & Environmental Modeling",
  "Automation Infrastructure",
];

export function About() {
  return (
    <section id="about">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">About</h2>
      <p className="mb-4">
        Georgia Tech engineering student working at the intersection of machine
        learning, robotics, and applied research. I build systems that solve
        real problems — from adversarial ML and autonomous perception to
        materials-property prediction and environmental modeling.
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
