import type { Metadata, Viewport } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import packageJson from "../../package.json";

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale ?? "en";
  return (
    <html lang={lang} className="dark">
      <body className="bg-slate-950 antialiased">
        {children}
        <ThemeToggle />
        <div className="fixed bottom-1 left-1 text-[10px] text-slate-500/30 z-50 pointer-events-none select-none font-mono">
          v{packageJson.version}
        </div>
      </body>
    </html>
  );
}
