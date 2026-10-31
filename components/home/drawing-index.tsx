"use client";

import { useEffect, useState } from "react";

export const SECTIONS = [
  ["work", "Work"],
  ["about", "About"],
  ["experience", "Experience"],
  ["research", "Research"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

/** Sticky drawing index. Plain anchors without JS; highlights the section in view when JS runs. */
export function DrawingIndex() {
  const [current, setCurrent] = useState<string>("work");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    SECTIONS.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) io.observe(node);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="drawing-index" aria-label="Sections">
      <p className="di-head">Index</p>
      {SECTIONS.map(([id, label], i) => (
        <a key={id} href={`#${id}`} aria-current={current === id ? "true" : undefined}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          {label}
        </a>
      ))}
    </nav>
  );
}
