import { education as e } from "@/data/education";
import { SectionHead } from "@/components/home/section-head";
import { Entry } from "@/components/home/entry";
import { SpineList } from "@/components/spine/spine-list";

export function Education() {
  return (
    <section id="education" className="sec">
      <SectionHead num="06" title="Education" />
      <SpineList
        segments={[
          {
            id: "education",
            colorVar: "var(--fam-optimization)",
            children: (
              <Entry
                meta={
                  <>
                    {e.period}
                    <br />
                    GPA {e.gpa}
                  </>
                }
                title={e.school}
                body={
                  <>
                    <p>{e.degree}</p>
                    <p className="text-muted">Minors: {e.minors.join("; ")}</p>
                    <p>
                      <span className="text-muted">Honors:</span> {e.honors.join(", ")}
                    </p>
                    <p>
                      <span className="text-muted">Coursework:</span> {e.coursework.join(", ")}
                    </p>
                  </>
                }
              />
            ),
          },
        ]}
      />
    </section>
  );
}
