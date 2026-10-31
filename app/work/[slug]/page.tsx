import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ELEMENTS } from "@/data/elements";
import { placeElements } from "@/lib/elements";
import { FAMILIES } from "@/lib/theme";
import { findingsSlugs, getFindings } from "@/content/findings";
import { Figure } from "@/components/findings/figure";
import { Footer } from "@/components/layout/footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return findingsSlugs().map((slug) => ({ slug }));
}

const placed = placeElements(ELEMENTS);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const el = placed.find((e) => e.slug === slug);
  return { title: el ? `${el.name} · Sumedh Kothari` : "Sumedh Kothari", description: getFindings(slug)?.lead.slice(0, 160) };
}

export default async function FindingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const el = placed.find((e) => e.slug === slug);
  const f = getFindings(slug);
  if (!el || !f) notFound();

  const pages = placed.filter((e) => e.kind !== "card");
  const i = pages.findIndex((e) => e.slug === slug);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const fam = `var(--fam-${el.family})`;

  return (
    <div className="page">
      <nav className="crumbs label">
        <a href="/#work">← Back to the table</a>
      </nav>
      <header className="find-head">
        <div className="find-cell" style={{ "--fam": fam, viewTransitionName: `el-${slug}` } as React.CSSProperties}>
          <span className="cell-num">{el.number}</span>
          <span className="cell-year">{el.year}</span>
          <span className="find-sym">{el.symbol}</span>
          <span className="find-fam label">{FAMILIES[el.family].label}</span>
        </div>
        <div className="find-title">
          <p className="label">
            {f.dates}
            {f.affiliation ? ` · ${f.affiliation}` : ""}
          </p>
          <h1>{el.name}</h1>
          <p className="find-lead">{f.lead}</p>
          <p className="hero-links">
            {el.links.map((l) => (
              <a key={l.href} className="btn-mono" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </p>
          <p className="label find-tags">{el.tech.join(" · ")}</p>
        </div>
      </header>

      {f.stats && f.stats.length > 0 && (
        <dl className="find-stats">
          {f.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd className="label">{s.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {f.figures.length > 0 && (
        <section className="find-sec">
          <h2 className="sec-head">
            <span className="sec-num">A</span>Key findings
          </h2>
          <div className="fig-grid">
            {f.figures.map((fig, n) => (
              <Figure key={n} fig={fig} n={n + 1} />
            ))}
          </div>
        </section>
      )}

      {f.steps.length > 0 && (
        <section className="find-sec">
          <h2 className="sec-head">
            <span className="sec-num">B</span>How it works
          </h2>
          <ol className="find-steps">
            {f.steps.map((s, n) => (
              <li key={n}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {f.limits && (
        <section className="find-sec">
          <h2 className="sec-head">
            <span className="sec-num">C</span>Details and limits
          </h2>
          <p className="prose-col">{f.limits}</p>
        </section>
      )}

      <nav className="pager" aria-label="Other findings">
        {prev ? (
          <a href={`/work/${prev.slug}/`}>
            <span className="label">← No. {prev.number}</span>
            {prev.name}
          </a>
        ) : (
          <span />
        )}
        <a href="/#work" className="pager-table">
          <span className="label">Index</span>Back to the table
        </a>
        {next ? (
          <a href={`/work/${next.slug}/`} className="pager-next">
            <span className="label">No. {next.number} →</span>
            {next.name}
          </a>
        ) : (
          <span />
        )}
      </nav>
      <Footer />
    </div>
  );
}
