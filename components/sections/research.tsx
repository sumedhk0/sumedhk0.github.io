import { research } from "@/data/research";

export function Research() {
  return (
    <section id="research">
      <h2 className="mb-4 border-b border-rule pb-2 text-xl">Research</h2>
      <div className="space-y-6">
        {research.map((item) => {
          const href = item.link ?? item.github ?? undefined;
          return (
            <div key={item.id}>
              <p>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {item.title} ↗
                  </a>
                ) : (
                  <span className="font-semibold">{item.title}</span>
                )}
                <span className="text-muted"> · {item.status}</span>
              </p>
              <p className="text-muted">{item.organization}</p>
              <p className="mt-1">{item.description}</p>
              <p className="mt-1 text-sm text-muted">{item.methods.join(" · ")}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
