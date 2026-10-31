import type { ReactNode } from "react";
import { SpineSvg } from "./spine-svg";
import "./spine.css";

export interface SpineSegment {
  id: string;
  /** A CSS colour, usually a token such as "var(--fam-materials)". */
  colorVar: string;
  children: ReactNode;
}

/**
 * A list of entries with a polymer-chain spine in the left gutter.
 * Each segment is one coloured block of the chain; elements inside it marked
 * `data-spine-entry` get a side group. Without JS a static zig-zag shows instead.
 */
export function SpineList({ segments }: { segments: SpineSegment[] }) {
  return (
    <div className="spine-list">
      <div className="spine-fallback" aria-hidden="true" />
      <SpineSvg />
      {segments.map((s) => (
        <div key={s.id} data-spine-seg="" style={{ "--seg": s.colorVar } as React.CSSProperties}>
          {s.children}
        </div>
      ))}
    </div>
  );
}
