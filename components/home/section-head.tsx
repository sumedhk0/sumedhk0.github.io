/** Numbered section heading; the number matches the drawing index. */
export function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="sec-head">
      <span className="sec-num">{num}</span>
      {title}
    </h2>
  );
}
