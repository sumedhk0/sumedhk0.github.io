import { research } from "@/data/research";
import { ELEMENT_OF } from "@/data/elements";
import { SectionHead } from "@/components/home/section-head";
import { Entry } from "@/components/home/entry";
import { SpineList } from "@/components/spine/spine-list";

export function Research() {
  const current = research.filter((r) => r.status === "In Progress");
  const past = research.filter((r) => r.status !== "In Progress");
  const toEntry = (r: (typeof research)[number]) => (
    <Entry
      key={r.id}
      element={ELEMENT_OF[r.id]}
      meta={
        <>
          {r.status}
          <br />
          {r.organization}
        </>
      }
      title={
        r.github ? (
          <a href={r.github} target="_blank" rel="noopener noreferrer">
            {r.title} ↗
          </a>
        ) : (
          r.title
        )
      }
      body={<p>{r.description}</p>}
      tags={r.methods}
    />
  );
  return (
    <section id="research" className="sec">
      <SectionHead num="04" title="Research" />
      <SpineList
        segments={[
          { id: "current", colorVar: "var(--fam-materials)", children: current.map(toEntry) },
          { id: "past", colorVar: "var(--fam-chemistry)", children: past.map(toEntry) },
        ]}
      />
    </section>
  );
}
