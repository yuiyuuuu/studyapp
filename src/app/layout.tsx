import type { Metadata } from "next";
import {
  Inter_Tight,
  JetBrains_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studyapp1 | Bold study flows",
  description:
    "An editorial landing page for a focused study platform built with a bold typography design system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body
        className={`${interTight.variable} ${playfairDisplay.variable} ${jetBrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
