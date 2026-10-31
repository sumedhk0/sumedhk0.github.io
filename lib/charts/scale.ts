export type Scale = (v: number) => number;

export function linearScale([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export function logScale([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  if (d0 <= 0 || d1 <= 0) throw new Error("logScale domain must be positive");
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  return (v) => r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0);
}

/** Round tick values on a 1 / 2 / 2.5 / 5 step ladder. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  const raw = (max - min) / Math.max(1, count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-9; t += step) ticks.push(Number(t.toFixed(10)));
  return ticks;
}

/** Powers of ten inside [min, max]. */
export function logTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  for (let k = Math.ceil(Math.log10(min)); 10 ** k <= max; k++) ticks.push(10 ** k);
  return ticks;
}
