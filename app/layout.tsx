import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sumedh Kothari | Engineer",
  description:
    "Georgia Tech engineering student building intelligent systems across software, robotics, and applied research.",
  metadataBase: new URL("https://sumedh.dev"),
  openGraph: {
    title: "Sumedh Kothari | Engineer",
    description:
      "Georgia Tech engineering student building intelligent systems across software, robotics, and applied research.",
    url: "https://sumedh.dev",
    siteName: "Sumedh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumedh Kothari | Engineer",
    description:
      "Georgia Tech engineering student building intelligent systems across software, robotics, and applied research.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
