import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Ontological Compass",
  description:
    "A gamified journey to define your exact concept of God — mapped through the history of philosophy. EN / RU / AZ.",
  keywords: ["philosophy", "theology", "quiz", "ontology", "god", "spinoza", "hegel", "aquinas"],
  openGraph: {
    title: "The Ontological Compass",
    description: "Define your exact concept of God through a gamified philosophical journey.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 antialiased">{children}</body>
    </html>
  );
}
