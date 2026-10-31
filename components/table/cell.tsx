import type { PlacedElement } from "@/lib/types";
import { FAMILIES } from "@/lib/theme";

interface CellProps {
  el: PlacedElement;
  colour: string;
  active: boolean;
  onActivate: () => void;
  onPin: () => void;
  register: (node: HTMLElement | null) => void;
}

/** One element cell. Links to its findings page when it has one, otherwise a button that pins the panel. */
export function Cell({ el, colour, active, onActivate, onPin, register }: CellProps) {
  // Starts with the text a sighted user sees on the smallest screens (number, symbol).
  const label = `${el.number} ${el.symbol} ${el.name}, element ${el.number}, ${FAMILIES[el.family].label}`;
  const body = (
    <>
      <span className="cell-num">{el.number}</span>
      <span className="cell-year" aria-hidden="true">{el.year}</span>
      <span className="cell-sym">{el.symbol}</span>{" "}
      <span className="cell-name">{el.name}</span>
    </>
  );
  const common = {
    className: "cell",
    "aria-label": label,
    "data-active": active || undefined,
    style: { gridColumn: el.col, gridRow: el.row, "--fam": colour } as React.CSSProperties,
    onMouseEnter: onActivate,
    onFocus: onActivate,
  };
  if (el.href) {
    return (
      <a
        {...common}
        href={el.href}
        ref={register}
        style={{ ...common.style, viewTransitionName: `el-${el.slug}` }}
      >
        {body}
      </a>
    );
  }
  return (
    <button {...common} type="button" ref={register} aria-pressed={active} onClick={onPin}>
      {body}
    </button>
  );
}
