"use client";

import { SectionReveal } from "@/components/motion/section-reveal";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { skills } from "@/data/skills";

const focusAreas = [
  "AI Systems",
  "Robotics & Computer Vision",
  "Environmental Modeling",
  "Automation Infrastructure",
];

export function About() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            01
          </p>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">About</h2>
        </SectionReveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <SectionReveal delay={0.1}>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Georgia Tech engineering student working at the intersection of
              software systems, robotics, and applied research. I build tools
              that solve real problems — from autonomous robots to environmental
              modeling pipelines to full-stack automation platforms.
            </p>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="space-y-6">
              {skills.map((category) => (
                <div key={category.name}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <AnimatedBadge key={skill} delay={i * 0.03}>
                        {skill}
                      </AnimatedBadge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
