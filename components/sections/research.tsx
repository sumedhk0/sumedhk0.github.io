"use client";

import { ExternalLink, Github } from "lucide-react";
import { research } from "@/data/research";
import { SectionReveal } from "@/components/motion/section-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Published: "bg-green-500/10 text-green-700 dark:text-green-400",
  "In Progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Submitted: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Completed: "bg-muted text-muted-foreground",
};

export function Research() {
  return (
    <section id="research" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            04
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Research</h2>
          <p className="mb-12 max-w-xl text-muted-foreground">
            Active and completed research spanning environmental systems,
            materials science, and computational modeling.
          </p>
        </SectionReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {research.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.05}>
              <TiltCard>
                {(() => {
                  const href = item.link ?? item.github ?? undefined;
                  const card = (
                    <div className={`group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md h-full ${href ? "border-border hover:bg-accent cursor-pointer" : "border-border"}`}>
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {item.organization}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColors[item.status]}`}
                          >
                            {item.status}
                          </span>
                          {item.github && (
                            <span
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(item.github, "_blank", "noopener,noreferrer"); }}
                              className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                              aria-label={`${item.title} GitHub`}
                            >
                              <Github className="h-4 w-4" />
                            </span>
                          )}
                          {item.link && (
                            <span
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(item.link, "_blank", "noopener,noreferrer"); }}
                              className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                              aria-label={`${item.title} link`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.methods.map((method) => (
                          <Badge
                            key={method}
                            variant="secondary"
                            className="font-[family-name:var(--font-geist-mono)] text-[10px]"
                          >
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                  return href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="block no-underline text-inherit h-full">
                      {card}
                    </a>
                  ) : card;
                })()}
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
