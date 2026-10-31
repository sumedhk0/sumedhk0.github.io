import type { Figure as FigureData } from "@/content/findings/types";
import { CHARTS } from "@/components/charts/registry";
import { InViewVideo } from "./in-view-video";

/** One numbered "Fig. n" figure: a build-time chart, an image, or an in-view video. */
export function Figure({ fig, n }: { fig: FigureData; n: number }) {
  let body: React.ReactNode = null;
  if (fig.kind === "chart") {
    const Chart = CHARTS[fig.chartId];
    body = Chart ? <Chart /> : null;
  } else if (fig.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    body = <img src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} loading="lazy" decoding="async" />;
  } else {
    body = <InViewVideo src={fig.src} poster={fig.poster} width={fig.width} height={fig.height} label={fig.caption} />;
  }
  return (
    <figure className="fig">
      <div className="fig-body">{body}</div>
      <figcaption>
        <b>Fig. {n}</b> — {fig.caption}
      </figcaption>
    </figure>
  );
}
