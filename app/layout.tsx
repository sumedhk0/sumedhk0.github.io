import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

// Font files are the main LCP cost on mobile, so keep the set small:
// Newsreader upright only (no italic), two Plex Sans weights, one Plex Mono
// weight. Mono stays preloaded: deferring it shifted the mono-heavy title
// block and table on swap (CLS 0.27).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sumedh Kothari",
  description:
    "ML for polymers and materials: fast interatomic potentials, RL-tuned polymer language models, and adversarial testing of LLMs.",
  metadataBase: new URL("https://sumedhk0.github.io"),
  openGraph: {
    title: "Sumedh Kothari",
    description:
      "ML for polymers and materials: fast interatomic potentials, RL-tuned polymer language models, and adversarial testing of LLMs.",
    url: "https://sumedhk0.github.io",
    siteName: "Sumedh Kothari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumedh Kothari",
    description:
      "ML for polymers and materials: fast interatomic potentials, RL-tuned polymer language models, and adversarial testing of LLMs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
