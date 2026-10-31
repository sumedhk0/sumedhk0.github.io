// Geometry for the polymer-chain spine: a skeletal-formula zig-zag whose
// vertices sit on multiples of `step`, alternating between two x positions.

export interface SpineGeometry {
  step: number;
  xL: number;
  xR: number;
}

export const DEFAULT_SPINE: SpineGeometry = { step: 22, xL: 14, xR: 38 };
export const NARROW_SPINE: SpineGeometry = { step: 12, xL: 6, xR: 18 };

const xAt = (y: number, g: SpineGeometry) => (Math.round(y / g.step) % 2 === 0 ? g.xL : g.xR);

/** SVG path data for the zig-zag between y0 and y1 (inclusive). */
export function spinePath(y0: number, y1: number, opts: Partial<SpineGeometry> = {}): string {
  const g = { ...DEFAULT_SPINE, ...opts };
  const first = Math.ceil(y0 / g.step) * g.step;
  const parts: string[] = [];
  for (let y = first; y <= y1; y += g.step) parts.push(`${parts.length ? "L" : "M"}${xAt(y, g)},${y}`);
  return parts.length ? parts.join(" ") : `M${xAt(first, g)},${first}`;
}

/** The vertex nearest to y, where an entry's side group attaches. */
export function snapToVertex(y: number, opts: Partial<SpineGeometry> = {}): { x: number; y: number } {
  const g = { ...DEFAULT_SPINE, ...opts };
  const vy = Math.round(y / g.step) * g.step;
  return { x: xAt(vy, g), y: vy };
}
