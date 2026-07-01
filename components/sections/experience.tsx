import { experiences } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id}>
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
        ))}
      </div>
    </section>
  );
}
