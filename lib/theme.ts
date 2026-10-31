// Single source of truth for colour. globals.css mirrors these hexes as CSS
// custom properties; tests/theme.test.ts fails if the two drift or if any
// pairing drops below WCAG AA.

export type Family = "materials" | "safety" | "optimization" | "vision" | "chemistry" | "software";

export interface Palette {
  paper: string;
  ink: string;
  muted: string;
  rule: string;
  blueprint: string;
  pencil: string;
}

export const PALETTE: { light: Palette; dark: Palette } = {
  light: { paper: "#f5f6f2", ink: "#1c2433", muted: "#5b6676", rule: "#c9d0d6", blueprint: "#2c5aa0", pencil: "#c23b22" },
  dark: { paper: "#11161d", ink: "#e6e9ee", muted: "#9aa5b4", rule: "#2b3440", blueprint: "#8fb3e8", pencil: "#f08a73" },
};

// Dark values sit in a narrow luminance band: dark enough for white symbol
// text on the hover fill, light enough to read as a bar on dark paper.
export const FAMILIES: Record<Family, { label: string; light: string; dark: string }> = {
  materials: { label: "ML for materials", light: "#2f62a8", dark: "#4370b8" },
  safety: { label: "LLM safety", light: "#b04a35", dark: "#b5513c" },
  optimization: { label: "Optimization", light: "#2f7d63", dark: "#2a7d62" },
  vision: { label: "Vision & hardware", light: "#8a5aa8", dark: "#895daa" },
  chemistry: { label: "Chemistry", light: "#93680f", dark: "#916710" },
  software: { label: "Software", light: "#5f6872", dark: "#6c7684" },
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two #rrggbb colours. */
export function contrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
