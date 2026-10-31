import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sumedh Kothari — ML for polymers and materials, Georgia Tech";

const NAME = "Sumedh Kothari";
const TAGLINE = "ML for polymers and materials";
const SUB = "Georgia Tech · Chemical & Biomolecular Engineering + CS";
const URL = "sumedhk0.github.io";
const CELL = { num: "17", year: "2026", sym: "Pf", label: "ML FOR MATERIALS" };

const PAPER = "#f5f6f2";
const INK = "#1c2433";
const MUTED = "#5b6676";
const BLUE = "#2c5aa0";
const GRID_MINOR = "rgba(44,90,160,0.05)";
const GRID_MAJOR = "rgba(44,90,160,0.11)";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\(/);
  if (!resource) throw new Error("Could not resolve font URL");
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error("Could not fetch font");
  return res.arrayBuffer();
}

export default async function Image() {
  const display = NAME + TAGLINE + CELL.sym;
  const mono = SUB + URL + CELL.num + CELL.year + CELL.label;

  let fonts;
  try {
    const [serif, plexMono] = await Promise.all([loadGoogleFont("Newsreader", 400, display), loadGoogleFont("IBM Plex Mono", 400, mono)]);
    fonts = [
      { name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const },
      { name: "Plex Mono", data: plexMono, weight: 400 as const, style: "normal" as const },
    ];
  } catch {
    // Fall back to the bundled default font if Google Fonts is unreachable.
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "80px 90px",
          backgroundColor: PAPER,
          backgroundImage: `linear-gradient(${GRID_MAJOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_MAJOR} 1px, transparent 1px), linear-gradient(${GRID_MINOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_MINOR} 1px, transparent 1px)`,
          backgroundSize: "40px 40px, 40px 40px, 8px 8px, 8px 8px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 280,
            height: 302,
            border: `3px solid ${INK}`,
            borderTop: `14px solid ${BLUE}`,
            backgroundColor: PAPER,
            padding: "16px 20px",
            fontFamily: "Plex Mono, monospace",
            color: MUTED,
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{CELL.num}</span>
            <span>{CELL.year}</span>
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontFamily: "Newsreader, serif", fontSize: 120, color: BLUE, lineHeight: 1 }}>
            {CELL.sym}
          </div>
          <div style={{ display: "flex", fontSize: 18, marginTop: 8 }}>{CELL.label}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Newsreader, serif", fontSize: 84, color: INK, lineHeight: 1 }}>{NAME}</div>
          <div style={{ fontFamily: "Newsreader, serif", fontSize: 40, color: BLUE, marginTop: 20 }}>{TAGLINE}</div>
          <div style={{ fontFamily: "Plex Mono, monospace", fontSize: 21, color: MUTED, marginTop: 24 }}>{SUB}</div>
          <div style={{ fontFamily: "Plex Mono, monospace", fontSize: 21, color: INK, marginTop: 12 }}>{URL}</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) },
  );
}
