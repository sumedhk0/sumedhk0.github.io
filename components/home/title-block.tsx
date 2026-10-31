const CELLS = [
  ["Drawn by", "Sumedh Kothari"],
  ["Institution", "Georgia Tech · ChBE + CS"],
  ["Sheet", "01 / 01"],
  ["Rev", "2026.10"],
  ["Scale", "1 : 1"],
];

/** Engineering-drawing title block that opens the page. */
export function TitleBlock() {
  return (
    <div className="title-block" role="presentation">
      {CELLS.map(([k, v]) => (
        <div key={k}>
          <small>{k}</small>
          {v}
        </div>
      ))}
    </div>
  );
}
