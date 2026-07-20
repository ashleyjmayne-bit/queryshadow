import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "QueryShadow",
    template: "%s · QueryShadow",
  },
  description: "See what your AI agent's searches reveal together—and rewrite the trail before private context leaves a shadow.",
  metadataBase: new URL("https://queryshadow.ashleyjmayne.chatgpt.site"),
  openGraph: {
    title: "QueryShadow — The leak is in the sequence",
    description: "A local-first privacy debugger for cumulative leakage across AI-agent search traces.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "QueryShadow",
    description: "See what your agent's searches reveal together.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
