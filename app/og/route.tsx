import { ImageResponse } from "next/og";

export const runtime = "edge";

const NAME = "Sumedh Kothari";
const TAGLINE = "Engineer building intelligent systems";
const SUB = "Georgia Tech · Chemical & Biomolecular Engineering + CS · 2028";
const URL = "sumedh.dev";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+"
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\(/);
  if (!resource) throw new Error("Could not resolve font URL");
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error("Could not fetch font");
  return res.arrayBuffer();
}

export async function GET() {
  const text = NAME + TAGLINE + SUB + URL;

  let fonts;
  try {
    const [regular, bold] = await Promise.all([
      loadGoogleFont("Lora", 400, text),
      loadGoogleFont("Lora", 700, text),
    ]);
    fonts = [
      { name: "Lora", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Lora", data: bold, weight: 700 as const, style: "normal" as const },
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
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#fdfdfc",
          padding: "90px",
          fontFamily: "Lora, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, fontWeight: 700, color: "#1a1a1a" }}>
            {NAME}
          </div>
          <div style={{ fontSize: 32, color: "#1a1a1a", marginTop: 22 }}>
            {TAGLINE}
          </div>
          <div style={{ fontSize: 23, color: "#6b6b6b", marginTop: 14 }}>
            {SUB}
          </div>
          <div style={{ fontSize: 22, color: "#1a4fd6", marginTop: 30 }}>
            {URL}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts ? { fonts } : {}),
    }
  );
}
