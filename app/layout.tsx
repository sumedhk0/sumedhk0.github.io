import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumedh Kothari",
  description:
    "Georgia Tech ML researcher working on LLM safety, machine-learned force fields for polymers, and learned optimization.",
  metadataBase: new URL("https://sumedh.dev"),
  openGraph: {
    title: "Sumedh Kothari",
    description:
      "Georgia Tech ML researcher working on LLM safety, machine-learned force fields for polymers, and learned optimization.",
    url: "https://sumedh.dev",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
