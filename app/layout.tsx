import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumedh Kothari",
  description:
    "Georgia Tech engineering student building intelligent systems across machine learning, robotics, and applied research.",
  metadataBase: new URL("https://sumedh.dev"),
  openGraph: {
    title: "Sumedh Kothari",
    description:
      "Georgia Tech engineering student building intelligent systems across machine learning, robotics, and applied research.",
    url: "https://sumedh.dev",
    siteName: "Sumedh Kothari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumedh Kothari",
    description:
      "Georgia Tech engineering student building intelligent systems across machine learning, robotics, and applied research.",
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
