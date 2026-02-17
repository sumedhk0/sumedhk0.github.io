"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { experiences } from "@/data/experience";
import { SectionReveal } from "@/components/motion/section-reveal";

function TimelineItem({
  experience,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute top-2 left-0 bottom-0 w-px bg-border" />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.2, delay: index * 0.08 + 0.1 }}
        className="absolute top-2 -left-[3px] h-[7px] w-[7px] rounded-full bg-foreground"
      />

      <div className="space-y-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold">{experience.role}</h3>
          <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
            {experience.period}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {experience.organization}
        </p>
        <ul className="mt-3 space-y-1.5">
          {experience.description.map((item, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            02
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight">
            Experience
          </h2>
        </SectionReveal>

        <div className="max-w-2xl">
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.id} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
