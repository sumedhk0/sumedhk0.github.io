"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Research } from "@/components/sections/research";
import { Contact } from "@/components/sections/contact";
import { ResumeModal } from "@/components/sections/resume";

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

export default function Home() {
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

      <main>
        <Hero onResumeOpen={() => setResumeOpen(true)} />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
