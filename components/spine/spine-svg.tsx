"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_SPINE, NARROW_SPINE, snapToVertex, spinePath } from "@/lib/spine";

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
  const [progress, setProgress] = useState(1);

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

    const onScroll = () => {
      const r = root.getBoundingClientRect();
      setProgress((window.innerHeight * 0.8 - r.top) / Math.max(1, r.height));
    };

    build();
    onScroll();
    const ro = new ResizeObserver(build);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("spine-ready");
    };
  }, []);

  const total = segments.length ? segments[segments.length - 1].top + segments[segments.length - 1].height : 1;
  const line = progress * total;

  return (
    <svg ref={ref} className="spine-svg" aria-hidden="true">
      {segments.map((s, i) => {
        const f = Math.min(1, Math.max(0, (line - s.top) / Math.max(1, s.height)));
        return (
          <path
            key={i}
            className="spine-path"
            d={s.d}
            pathLength={1}
            stroke={s.colour}
            style={{ strokeDashoffset: 1 - f }}
          />
        );
      })}
      {sides.map((s, i) => {
        const shown = line >= s.y ? 1 : 0.15;
        return (
          <g key={i} style={{ opacity: shown }}>
            <line className="spine-side" x1={s.x} y1={s.y} x2={s.end - 4} y2={s.y} stroke={s.colour} />
            <circle className="spine-atom" cx={s.end} cy={s.y} r={4} stroke={s.colour} />
          </g>
        );
      })}
    </svg>
  );
}
