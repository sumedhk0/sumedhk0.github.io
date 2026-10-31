import type { ReactNode } from "react";
import { ELEMENTS } from "@/data/elements";

interface EntryProps {
  meta: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  tags?: string[];
  /** Element slug this entry belongs to; shows a small cell that links to its findings or the table. */
  element?: string;
}

/** A ruled two-column row: mono meta on the left, content on the right. Marked for the spine. */
export function Entry({ meta, title, body, tags, element }: EntryProps) {
  const el = element ? ELEMENTS.find((e) => e.slug === element) : undefined;
  return (
    <article className="entry" data-spine-entry="">
      <div className="entry-meta label">{meta}</div>
      <div className="entry-main">
        <h3 className="entry-title">
          {el && (
            <a
              className="entry-el"
              href={el.kind === "card" ? "#work" : `/work/${el.slug}/`}
              style={{ "--fam": `var(--fam-${el.family})` } as React.CSSProperties}
              aria-label={el.kind === "card" ? `${el.name} on the table` : `${el.name} findings`}
            >
              {el.symbol}
            </a>
          )}
          {title}
        </h3>
        {body}
        {tags && tags.length > 0 && <p className="entry-tags label">{tags.join(" · ")}</p>}
      </div>
    </article>
  );
}
