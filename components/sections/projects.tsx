import { projects } from "@/data/projects";
import { ELEMENT_OF } from "@/data/elements";
import { SectionHead } from "@/components/home/section-head";
import { Entry } from "@/components/home/entry";
import { SpineList } from "@/components/spine/spine-list";

const real = (href?: string) => (href && href !== "#" ? href : undefined);

export function Projects() {
  const groups: { id: string; colorVar: string; cat: string }[] = [
    { id: "research-projects", colorVar: "var(--fam-materials)", cat: "Research" },
    { id: "hardware", colorVar: "var(--fam-hardware)", cat: "Hardware" },
    { id: "software", colorVar: "var(--fam-data)", cat: "Software" },
  ];
  return (
    <section id="projects" className="sec">
      <SectionHead num="05" title="Projects" />
      <SpineList
        segments={groups.map((g) => ({
          id: g.id,
          colorVar: g.colorVar,
          children: projects
            .filter((p) => p.category === g.cat)
            .map((p) => {
              const gh = real(p.github);
              const live = real(p.live);
              return (
                <Entry
                  key={p.id}
                  element={ELEMENT_OF[p.id]}
                  meta={
                    <>
                      {p.category}
                      {(gh || live) && (
                        <span className="entry-links">
                          {live && (
                            <a href={live} target="_blank" rel="noopener noreferrer">
                              Live ↗
                            </a>
                          )}
                          {gh && (
                            <a href={gh} target="_blank" rel="noopener noreferrer">
                              Code ↗
                            </a>
                          )}
                        </span>
                      )}
                    </>
                  }
                  title={p.title}
                  body={<p>{p.description}</p>}
                  tags={p.tech}
                />
              );
            }),
        }))}
      />
    </section>
  );
}
