"use client";

import { useEffect, useRef, useState } from "react";
import { activeSection } from "@/lib/sections";

export const SECTIONS = [
  ["work", "Work"],
  ["about", "About"],
  ["experience", "Experience"],
  ["research", "Research"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

const IDS = SECTIONS.map(([id]) => id);
const USER_SCROLL = ["wheel", "touchstart", "keydown"] as const;

/** Sticky drawing index. Plain anchors without JS; highlights the section in view when JS runs. */
export function DrawingIndex() {
  const [current, setCurrent] = useState<string>("work");
  // After a click, keep the clicked link current until the reader scrolls themselves;
  // the jump it causes may not bring a short section up to the reading line.
  const clicked = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (clicked.current) return;
      const tops = IDS.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity);
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setCurrent(activeSection(IDS, tops, window.innerHeight, atBottom));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const release = () => {
      clicked.current = false;
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    for (const ev of USER_SCROLL) window.addEventListener(ev, release, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const ev of USER_SCROLL) window.removeEventListener(ev, release);
    };
  }, []);

  return (
    <nav className="drawing-index" aria-label="Sections">
      <p className="di-head">Index</p>
      {SECTIONS.map(([id, label], i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={current === id ? "true" : undefined}
          onClick={() => {
            clicked.current = true;
            setCurrent(id);
          }}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
          {label}
        </a>
      ))}
    </nav>
  );
}
