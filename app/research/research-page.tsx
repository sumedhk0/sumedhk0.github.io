"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { ResearchSection } from "@/components/sections/research";
import { ResumeModal } from "@/components/sections/resume";
import { SectionReveal } from "@/components/motion/section-reveal";

const CommandPalette = dynamic(
  () =>
    import("@/components/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

const CustomCursor = dynamic(
  () =>
    import("@/components/layout/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

export function ResearchPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCommandOpen={() => setCommandOpen(true)} />
      <ScrollProgress />
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onResumeOpen={() => setResumeOpen(true)}
      />
      <ResumeModal open={resumeOpen} onOpenChange={setResumeOpen} />

      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <a
              href="/"
              className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back
            </a>
            <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
              04
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight">
              Research
            </h1>
            <p className="mb-12 max-w-xl text-muted-foreground">
              Active research spanning environmental systems, materials science,
              and computational modeling.
            </p>
          </SectionReveal>

          <ResearchSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
