import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => {
          const github =
            project.github && project.github !== "#" ? project.github : undefined;
          const live =
            project.live && project.live !== "#" ? project.live : undefined;
          return (
            <div key={project.id}>
              <p className="font-semibold">{project.title}</p>
              {(github || live) && (
                <p className="text-muted">
                  {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {github && live && "  ·  "}
                  {live && (
                    <a href={live} target="_blank" rel="noopener noreferrer">
                      Live ↗
                    </a>
                  )}
                </p>
              )}
              <p className="text-muted">{project.description}</p>
              <p className="mt-1 text-sm text-muted">{project.tech.join(" · ")}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
