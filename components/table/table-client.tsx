"use client";

import { useRef, useState } from "react";
import type { Family, PlacedElement } from "@/lib/types";
import { FAMILIES } from "@/lib/theme";
import { GROUP_ORDER, neighbor, type ArrowKey } from "@/lib/elements";
import { Cell } from "./cell";
import "./table.css";

type Mode = "field" | "year";

// Year colouring reuses tested family tokens, so contrast is already proven.
const YEAR_VAR: Record<number, string> = {
  2024: "var(--fam-data)",
  2025: "var(--fam-optimization)",
  2026: "var(--fam-materials)",
};
const familyVar = (f: Family) => `var(--fam-${f})`;
// Real main-group numbers (IUPAC), so the header reads like a periodic table's.
const IUPAC_GROUP = [1, 2, 13, 14, 15, 16, 17, 18];

export function TableClient({ elements, initial }: { elements: PlacedElement[]; initial: string }) {
  const [mode, setMode] = useState<Mode>("field");
  const [active, setActive] = useState(initial);
  const [pinned, setPinned] = useState<string | null>(null);
  const refs = useRef(new Map<number, HTMLElement>());

  const colourOf = (el: PlacedElement) => (mode === "field" ? familyVar(el.family) : YEAR_VAR[el.year]);
  const periods = [...Array(Math.max(...elements.map((e) => e.row)))].map((_, i) => i + 1);
  const shown = elements.find((e) => e.slug === (pinned ?? active)) ?? elements[0];

  function onKeyDown(e: React.KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    const current = elements.find((el) => refs.current.get(el.number) === document.activeElement);
    if (!current) return;
    e.preventDefault();
    refs.current.get(neighbor(elements, current.number, e.key as ArrowKey))?.focus();
  }

  const legend =
    mode === "field"
      ? (Object.keys(FAMILIES) as Family[]).map((f) => ({ key: f, label: FAMILIES[f].label, colour: familyVar(f) }))
      : Object.entries(YEAR_VAR).map(([y, c]) => ({ key: y, label: y, colour: c }));

  return (
    <div className="pt-wrap">
      <div className="pt-main">
        <div className="pt-toolbar">
          <p className="label">Group = field · newest at the top · colour = {mode}</p>
          <div className="pt-toggle" role="group" aria-label="Colour cells by">
            {(["field", "year"] as Mode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m === "field" ? "Field" : "Year"}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-groups label" aria-hidden="true">
          <span />
          {GROUP_ORDER.map((f, i) => (
            <span key={f} style={{ "--fam": familyVar(f) } as React.CSSProperties}>
              <b>{IUPAC_GROUP[i]}</b>
              <small>{FAMILIES[f].short}</small>
            </span>
          ))}
        </div>
        <div className="pt-grid" onKeyDown={onKeyDown}>
          {periods.map((p) => (
            <span key={p} className="pt-period label" style={{ gridRow: p }} aria-hidden="true">
              {p}
            </span>
          ))}
          {elements.map((el) => (
            <Cell
              key={el.slug}
              el={el}
              colour={colourOf(el)}
              active={shown.slug === el.slug}
              pinned={pinned === el.slug}
              onActivate={() => setActive(el.slug)}
              onPin={() => setPinned((p) => (p === el.slug ? null : el.slug))}
              register={(node) => {
                if (node) refs.current.set(el.number, node);
                else refs.current.delete(el.number);
              }}
            />
          ))}
        </div>
        <ul className="pt-legend">
          {legend.map((l) => (
            <li key={l.key}>
              <i style={{ background: l.colour }} />
              {l.label}
            </li>
          ))}
        </ul>
      </div>
      <aside className="pt-panel" aria-live="polite" style={{ "--fam": colourOf(shown) } as React.CSSProperties}>
        <div className="pt-panel-head">
          <span className="pt-panel-sym">{shown.symbol}</span>
          <span className="label">
            No. {shown.number} · {shown.year}
            <br />
            {FAMILIES[shown.family].label}
          </span>
        </div>
        <h3 className="pt-panel-name">{shown.name}</h3>
        <p className="pt-panel-result">{shown.oneLiner}</p>
        <p className="label pt-panel-tech">{shown.tech.join(" · ")}</p>
        <p className="pt-panel-links">
          {shown.href && <a href={shown.href}>Open findings →</a>}
          {shown.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </p>
      </aside>
    </div>
  );
}
