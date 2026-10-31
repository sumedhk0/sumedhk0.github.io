import { experiences } from "@/data/experience";
import { SpineList } from "@/components/spine/spine-list";

export function Experience() {
  return (
    <section id="experience">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">Experience</h2>
      <SpineList
        segments={[
          {
            id: "experience",
            colorVar: "var(--blueprint)",
            children: experiences.map((exp) => (
              <div key={exp.id} data-spine-entry="" className="py-3">
                <div className="flex justify-between gap-4">
                  <p className="font-semibold">{exp.organization}</p>
                  <p className="whitespace-nowrap text-muted">{exp.period}</p>
                </div>
                <p className="text-muted">{exp.role}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )),
          },
        ]}
      />
    </section>
  );
}
