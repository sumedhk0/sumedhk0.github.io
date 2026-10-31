import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Research } from "@/components/sections/research";
import { Contact } from "@/components/sections/contact";
import { PeriodicTable } from "@/components/table/periodic-table";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-16">
      <Hero />
      <section id="work" className="mb-16">
        <PeriodicTable />
      </section>
      <div className="space-y-16">
        <About />
        <Education />
        <Experience />
        <Projects />
        <Research />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
