"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionReveal } from "@/components/motion/section-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Software", "Hardware", "Research"] as const;

export function Projects() {
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            03
          </p>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Projects</h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  filter === cat
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionReveal>

        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <TiltCard>
                  <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-semibold">{project.title}</h3>
                      <div className="flex gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`${project.title} GitHub`}
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`${project.title} live demo`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="font-[family-name:var(--font-geist-mono)] text-[10px]"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
