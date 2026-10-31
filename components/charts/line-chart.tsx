import { linearScale, logScale, logTicks, niceTicks } from "@/lib/charts/scale";
import "./charts.css";

export interface Series {
  name: string;
  points: [number, number][];
  highlight?: boolean;
  /** Mark an out-of-memory failure just past the last point at this x. */
  oomAfter?: number;
}

interface LineChartProps {
  series: Series[];
  xLog?: boolean;
  yLog?: boolean;
  xLabel: string;
  yLabel: string;
  ariaLabel: string;
}

const W = 560;
const H = 320;
const M = { l: 58, r: 20, t: 16, b: 46 };
const DASHES = ["", "6 4", "2 3", "8 3 2 3"];

const fmt = (v: number) => (v >= 1000 ? `${v / 1000}k` : `${Number(v.toPrecision(3))}`);

/** Multi-series line plot; owner's series in blueprint, baselines muted with distinct dashes. */
export function LineChart({ series, xLog, yLog, xLabel, yLabel, ariaLabel }: LineChartProps) {
  const xs = series.flatMap((s) => [...s.points.map((p) => p[0]), ...(s.oomAfter ? [s.oomAfter] : [])]);
  const ys = series.flatMap((s) => s.points.map((p) => p[1]));
  const xd: [number, number] = xLog
    ? [10 ** Math.floor(Math.log10(Math.min(...xs))), 10 ** Math.ceil(Math.log10(Math.max(...xs)))]
    : [0, Math.max(...xs)];
  const yd: [number, number] = yLog
    ? [10 ** Math.floor(Math.log10(Math.min(...ys))), 10 ** Math.ceil(Math.log10(Math.max(...ys)))]
    : [0, Math.max(...ys) * 1.05];
  const x = (xLog ? logScale : linearScale)(xd, [M.l, W - M.r]);
  const y = (yLog ? logScale : linearScale)(yd, [H - M.b, M.t]);
  const xt = xLog ? logTicks(xd[0], xd[1]) : niceTicks(xd[0], xd[1]);
  const yt = yLog ? logTicks(yd[0], yd[1]) : niceTicks(yd[0], yd[1]);
  let dashIdx = 0;
  let oomIdx = 0;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
      {xt.map((t) => (
        <g key={`x${t}`}>
          <line className="chart-grid" x1={x(t)} x2={x(t)} y1={M.t} y2={H - M.b} />
          <text className="chart-tick" x={x(t)} y={H - M.b + 16} textAnchor="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      {yt.map((t) => (
        <g key={`y${t}`}>
          <line className="chart-grid" x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} />
          <text className="chart-tick" x={M.l - 8} y={y(t) + 4} textAnchor="end">
            {fmt(t)}
          </text>
        </g>
      ))}
      <rect className="chart-frame" x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} />
      {series.map((s) => {
        const cls = s.highlight ? "chart-line hl" : "chart-line";
        const dash = s.highlight ? "" : DASHES[(dashIdx++ % (DASHES.length - 1)) + 1];
        const last = s.points[s.points.length - 1];
        return (
          <g key={s.name}>
            <polyline className={cls} strokeDasharray={dash} points={s.points.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")} />
            {s.points.map(([a, b]) => (
              <circle key={a} className={s.highlight ? "chart-pt hl" : "chart-pt"} cx={x(a)} cy={y(b)} r={3.5} />
            ))}
            {s.oomAfter && (
              <g>
                <line className="chart-ref" x1={x(s.oomAfter)} x2={x(s.oomAfter)} y1={H - M.b} y2={H - M.b - 10} />
                <text className="chart-oom" x={x(s.oomAfter)} y={H - M.b - 14 - 13 * oomIdx++} textAnchor="middle">
                  × {s.name} OOM
                </text>
              </g>
            )}
            <text className={s.highlight ? "chart-series hl" : "chart-series"} x={x(last[0]) + 6} y={y(last[1]) - 8}>
              {s.name}
            </text>
          </g>
        );
      })}
      <text className="chart-axis-label" x={(M.l + W - M.r) / 2} y={H - 8} textAnchor="middle">
        {xLabel}
      </text>
      <text className="chart-axis-label" transform={`translate(14 ${(M.t + H - M.b) / 2}) rotate(-90)`} textAnchor="middle">
        {yLabel}
      </text>
    </svg>
  );
}
