import { linearScale, logScale, logTicks, niceTicks } from "@/lib/charts/scale";
import "./charts.css";

export interface BarRow {
  label: string;
  value: number;
  highlight?: boolean;
  /** Text printed after the bar; defaults to the value with its unit. */
  note?: string;
}

interface BarChartProps {
  rows: BarRow[];
  unit?: string;
  log?: boolean;
  /** Axis maximum; defaults to the largest value. */
  max?: number;
  refLine?: { value: number; label: string };
  ariaLabel: string;
}

const W = 560;
const LABEL_W = 170;
const RIGHT = 90;
const ROW_H = 30;

/** Horizontal bars on a 0-based (or log) axis. Owner's result in blueprint, baselines muted. */
export function BarChart({ rows, unit = "", log, max, refLine, ariaLabel }: BarChartProps) {
  const top = Math.max(max ?? 0, ...rows.map((r) => r.value));
  const minLog = log ? 10 ** Math.floor(Math.log10(Math.min(...rows.map((r) => r.value)))) : 0;
  const maxLog = log ? 10 ** Math.ceil(Math.log10(top)) : top;
  const x = log ? logScale([minLog, maxLog], [LABEL_W, W - RIGHT]) : linearScale([0, top], [LABEL_W, W - RIGHT]);
  const ticks = log ? [minLog, ...logTicks(minLog * 1.0001, maxLog)] : niceTicks(0, top);
  const plotBottom = 10 + rows.length * ROW_H;
  const H = plotBottom + 30;
  const fmt = (v: number) => `${Number(v.toPrecision(4))}${unit}`;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
      {ticks.map((t) => (
        <g key={t}>
          <line className="chart-grid" x1={x(t)} x2={x(t)} y1={6} y2={plotBottom} />
          <text className="chart-tick" x={x(t)} y={plotBottom + 16} textAnchor="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = 12 + i * ROW_H;
        const x0 = x(log ? minLog : 0);
        return (
          <g key={r.label}>
            <text className="chart-label" x={LABEL_W - 10} y={y + 13} textAnchor="end">
              {r.label}
            </text>
            <rect
              className={r.highlight ? "chart-bar hl" : "chart-bar"}
              x={x0}
              y={y}
              width={Math.max(1, x(r.value) - x0)}
              height={18}
            />
            <text className="chart-value" x={x(r.value) + 6} y={y + 13}>
              {r.note ?? fmt(r.value)}
            </text>
          </g>
        );
      })}
      {refLine && (
        <g>
          <line className="chart-ref" x1={x(refLine.value)} x2={x(refLine.value)} y1={4} y2={plotBottom} />
          <text className="chart-ref-label" x={x(refLine.value) + 4} y={8}>
            {refLine.label}
          </text>
        </g>
      )}
      <line className="chart-axis" x1={x(log ? minLog : 0)} x2={x(log ? minLog : 0)} y1={6} y2={plotBottom} />
    </svg>
  );
}
