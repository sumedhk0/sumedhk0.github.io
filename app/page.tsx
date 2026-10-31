import { Hero } from "@/components/home/hero";
import { TitleBlock } from "@/components/home/title-block";
import { DrawingIndex } from "@/components/home/drawing-index";
import { SectionHead } from "@/components/home/section-head";
import { PeriodicTable } from "@/components/table/periodic-table";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Research } from "@/components/sections/research";
import { Projects } from "@/components/sections/projects";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="page">
      <TitleBlock />
      <Hero />
      <div className="sheet">
        <DrawingIndex />
        <main className="sheet-main">
          <section id="work" className="sec">
            <SectionHead num="01" title="Work" />
            <PeriodicTable />
          </section>
          <About />
          <Experience />
          <Research />
          <Projects />
          <Education />
          <Contact />
        </main>
      </div>
      <Footer />
    </div>
  );
}
