import { education } from "@/data/education";

export function Education() {
  const e = education;
  return (
    <section id="education">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">Education</h2>
      <div className="flex justify-between gap-4">
        <p className="font-semibold">{e.school}</p>
        <p className="whitespace-nowrap text-muted">{e.period}</p>
      </div>
      <p>{e.degree}</p>
      <p className="text-muted">
        Minors: {e.minors.join("; ")} · GPA: {e.gpa}
      </p>
      <p className="mt-3">
        <span className="text-muted">Honors:</span> {e.honors.join(", ")}
      </p>
      <p>
        <span className="text-muted">Coursework:</span> {e.coursework.join(", ")}
      </p>
    </section>
  );
}
