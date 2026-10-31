import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sumedh Kothari",
  description:
    "Georgia Tech ML researcher working on LLM safety, machine-learned force fields for polymers, and learned optimization.",
  metadataBase: new URL("https://sumedhk0.github.io"),
  openGraph: {
    title: "Sumedh Kothari",
    description:
      "Georgia Tech ML researcher working on LLM safety, machine-learned force fields for polymers, and learned optimization.",
    url: "https://sumedhk0.github.io",
    siteName: "Sumedh Kothari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumedh Kothari",
    description:
      "Georgia Tech ML researcher working on LLM safety, machine-learned force fields for polymers, and learned optimization.",
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
