"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_SPINE, NARROW_SPINE, snapToVertex, spineDraw, spinePath } from "@/lib/spine";

interface Segment {
  d: string;
  colour: string;
  top: number;
  height: number;
}
interface Side {
  x: number;
  y: number;
  end: number;
  colour: string;
}

/** Measures the list's segments and entries, then draws the chain and its side groups. */
export function SpineSvg() {
  const ref = useRef<SVGSVGElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [sides, setSides] = useState<Side[]>([]);

  useEffect(() => {
    const svg = ref.current;
    const root = svg?.parentElement;
    if (!svg || !root) return;
    root.classList.add("spine-ready");

    const build = () => {
      const narrow = window.matchMedia("(max-width: 480px)").matches;
      const g = narrow ? NARROW_SPINE : DEFAULT_SPINE;
      const end = narrow ? 26 : 54;
      const rootTop = root.getBoundingClientRect().top;
      const segs: Segment[] = [];
      const sds: Side[] = [];
      root.querySelectorAll<HTMLElement>("[data-spine-seg]").forEach((seg) => {
        const r = seg.getBoundingClientRect();
        const top = r.top - rootTop;
        const colour = seg.style.getPropertyValue("--seg") || "var(--muted)";
        segs.push({ d: spinePath(top, r.bottom - rootTop, g), colour, top, height: r.height });
        seg.querySelectorAll<HTMLElement>("[data-spine-entry]").forEach((entry) => {
          const v = snapToVertex(entry.getBoundingClientRect().top - rootTop + 14, g);
          sds.push({ ...v, end, colour });
        });
      });
      setSegments(segs);
      setSides(sds);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(root);
    return () => {
      ro.disconnect();
      root.classList.remove("spine-ready");
    };
  }, []);

  // Scroll drawing writes straight to the SVG, once per frame, so scrolling never
  // re-renders React or competes with hover feedback on the main thread.
  useEffect(() => {
    const svg = ref.current;
    const root = svg?.parentElement;
    if (!svg || !root || segments.length === 0) return;
    const paths = svg.querySelectorAll<SVGPathElement>(".spine-path");
    const groups = svg.querySelectorAll<SVGGElement>("g");
    let frame = 0;
    let last = NaN;
    const paint = () => {
      frame = 0;
      const r = root.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / Math.max(1, r.height)));
      if (p === last) return;
      last = p;
      const { offsets, opacities } = spineDraw(p, segments, sides);
      paths.forEach((el, i) => (el.style.strokeDashoffset = String(offsets[i])));
      groups.forEach((el, i) => (el.style.opacity = String(opacities[i])));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [segments, sides]);

  return (
    <svg ref={ref} className="spine-svg" aria-hidden="true">
      {segments.map((s, i) => (
        <path key={i} className="spine-path" d={s.d} pathLength={1} stroke={s.colour} />
      ))}
      {sides.map((s, i) => (
        <g key={i} className="spine-group">
          <line className="spine-side" x1={s.x} y1={s.y} x2={s.end - 4} y2={s.y} stroke={s.colour} />
          <circle className="spine-atom" cx={s.end} cy={s.y} r={4} stroke={s.colour} />
        </g>
      ))}
    </svg>
  );
}
