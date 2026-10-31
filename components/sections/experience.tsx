import { experiences } from "@/data/experience";
import { SectionHead } from "@/components/home/section-head";
import { Entry } from "@/components/home/entry";
import { SpineList } from "@/components/spine/spine-list";

const ELEMENT_FOR_ROLE: Record<string, string> = { "ramprasad-lab": "pf", "witness-ai": "as", "cheme-cube": "cc", "gt-rbi": "lg", "gt-hytech": "ht", "dressen-lab": "mf" };

export function Experience() {
  return (
    <section id="experience" className="sec">
      <SectionHead num="03" title="Experience" />
      <SpineList
        segments={[
          {
            id: "experience",
            colorVar: "var(--blueprint)",
            children: experiences.map((exp) => (
              <Entry
                key={exp.id}
                element={ELEMENT_FOR_ROLE[exp.id]}
                meta={
                  <>
                    {exp.period}
                    <br />
                    {exp.role}
                  </>
                }
                title={exp.organization}
                body={
                  <ul className="entry-list">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                }
              />
            )),
          },
        ]}
      />
    </section>
  );
}
