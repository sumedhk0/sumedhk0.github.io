import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Cell } from "@/components/table/cell";
import { ELEMENTS } from "@/data/elements";
import { placeElements } from "@/lib/elements";

const card = placeElements(ELEMENTS).find((e) => e.kind === "card")!;
const noop = () => {};

test("aria-pressed reflects the pinned state, not hover", () => {
  const hovered = renderToStaticMarkup(
    <Cell el={card} colour="red" active pinned={false} onActivate={noop} onPin={noop} register={noop} />,
  );
  expect(hovered).toContain('aria-pressed="false"');
  const pinned = renderToStaticMarkup(
    <Cell el={card} colour="red" active pinned onActivate={noop} onPin={noop} register={noop} />,
  );
  expect(pinned).toContain('aria-pressed="true"');
});
